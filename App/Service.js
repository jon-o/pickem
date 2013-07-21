var db = require('./DataAccess/Database.js');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

exports.retrivePicksForCurrentRound = function (seasonId, uid) {
    var eventEmitter = new EventEmitter();
    
    var currentRoundSql = 
'SELECT round as Round ' +
'FROM rounds ' +
'WHERE roundstartdate <= NOW() ' +
'AND seasonid = $1 ' +
'ORDER BY roundstartdate DESC ' +
'LIMIT 1;';
    
    var query = db.executeQuery(currentRoundSql, [seasonId]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(roundId) {
        var criteria = {
            seasonId: seasonId,
            roundId: roundId.rowCount > 0 ? roundId.rows[0].round : 0,
            uid: uid
        };            
        
        var picks = getPicksFor(criteria);
    
        picks.on('error', function(err) {
            eventEmitter.emit('error', err);
        });
        
        picks.on('end', function(result) {
            eventEmitter.emit('end', result);        
        });                
    });
    
    return eventEmitter;
};

exports.retrievePicksFor = function(criteria) {
    return getPicksFor(criteria);
};

var getPicksFor = function (criteria) {        
    var eventEmitter = new EventEmitter();
    
    var picksSql = 
'SELECT g.dateandtime AS DateAndTime, t1.name AS Home, t2.name AS Away, p.pick AS Pick, s.allowdraw AS AllowDraw, g.score as Score, g.id as Id, r.text AS RoundText, sea.name AS SeasonName ' +
'FROM games g ' +
'JOIN teams t1 ON g.hometeamid = t1.id ' +
'JOIN teams t2 ON g.awayteamid = t2.id ' +
'JOIN rounds r on g.roundid = r.id ' +
'JOIN seasons sea on r.seasonId = sea.id ' +
'JOIN leagues l on sea.leagueId = l.id ' +
'JOIN sports s ON l.sportid = s.id ' +
'LEFT JOIN users u ON u.thirdpartyid = $1 ' +
'LEFT JOIN Picks p ON g.Id = p.GameId AND p.UserId = u.Id ' +
'WHERE g.RoundId = ( ' +
'    SELECT id ' +
'    FROM Rounds ' +
'    WHERE Round = $2 ' +
'	AND SeasonId = $3) ' +
'ORDER BY dateandtime;'

    var firstLastRoundsSql = 
'SELECT MIN(Round) AS FirstRound, MAX(Round) AS LastRound ' +
'FROM rounds ' +
'WHERE SeasonId = $1';
    
    var parallelQuery = db.executeQueries([
        { query: picksSql, params: [criteria.uid, criteria.roundId, criteria.seasonId], name: 'picks'},        
        { query: firstLastRoundsSql, params: [criteria.seasonId], name: 'firstLastRounds'}]);
    
    parallelQuery.on('error', function(err) {
       eventEmitter.emit('error', err);
    });
    
    parallelQuery.on('end', function(results) {
        var response = { 
            round: {
                games: buildGamesCollection(results.picks.rows),
                id: criteria.roundId,
                text: results.picks.rowCount > 0 ? results.picks.rows[0].roundtext : 'Invalid round',
                navigation: getPicksNavigationUri(results.firstLastRounds.rows[0], criteria.seasonId, criteria.roundId)
            },
            season : {
                name: results.picks.rowCount > 0 ? results.picks.rows[0].seasonname : 'Invalid season'
            }
        };
        
        eventEmitter.emit('end', response);
    });    
    
    return eventEmitter;
};

var buildGamesCollection = function (games) {
    var currentDateTime = new Date();
    
    var gamesCollection = _.map(games, function(game) {
        var gameDateTime = new Date(Date.parse(game.dateandtime));
        
        return {
            date: game.dateandtime,
            home: game.home,
            away: game.away,
            pick: game.pick,
            allowDraw: game.allowdraw,
            score: game.score,
            id: game.id,
            hasBegun: (gameDateTime < currentDateTime) ? true : false
        };
    });
    
    return gamesCollection;
};

var getPicksNavigationUri = function (firstLastRounds, season, selectedRound) {
    var selectedRoundInt = parseInt(selectedRound, 10);
    var validSeasonId = firstLastRounds.firstRound !== null;
    
    var isValidFirstRound = (validSeasonId && selectedRoundInt !== parseInt(firstLastRounds.firstround, 10));
    var isValidLastRound = (validSeasonId && selectedRoundInt !== parseInt(firstLastRounds.lastround, 10));    
    
    var uris = {
        previousUri: isValidFirstRound ? 
            buildPicksNavigationUri(season, selectedRoundInt - 1) : null,
        nextUri: isValidLastRound ?
            buildPicksNavigationUri(season, selectedRoundInt + 1) : null
    };
    
    return uris;
};

var buildPicksNavigationUri = function (seasonId, round) {
    var getPicksUri = util.format('/api/picks/season/%s/round/%s',
        seasonId, round);
        
    return getPicksUri;
};

exports.savePick = function(criteria) {
    console.log(util.format('SavePick: UID: %s; GameId: %d; Pick: %s',
        criteria.uid, criteria.gameId, criteria.pick));
    
    var eventEmitter = new EventEmitter();
    
    var query = db.executeUpsert(util.format('%s %s %s %s',
'UPDATE picks SET pick = $3',
'WHERE userid = (SELECT id FROM users WHERE thirdpartyid = $1) AND gameid = $2;',
'INSERT INTO picks (userid, gameid, pick) SELECT (SELECT id FROM users WHERE thirdpartyid = $1), $2, $3',
'WHERE NOT EXISTS (SELECT 1 FROM picks WHERE userid = (SELECT id FROM users WHERE thirdpartyid = $1) AND gameid = $2);'),
    [criteria.uid, criteria.gameId, criteria.pick]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};

exports.createUser = function(criteria) {
    console.log(util.format('CreateUser: UID: %s; FacebookId: %d', 
        criteria.uid, criteria.facebookId));
    
    var eventEmitter = new EventEmitter();

    var query = db.executeQuery(util.format('%s %s',
'INSERT INTO users (thirdpartyid, facebookid) SELECT $1, $2',
'WHERE NOT EXISTS (SELECT 1 FROM users WHERE thirdpartyid = CAST($1 AS varchar(30)))'),
    [criteria.uid, criteria.facebookId]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};























