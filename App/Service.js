var db = require('./DataAccess/Database.js');
var sql = require('./DataAccess/Sql.js');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');


exports.retrivePicksForCurrentRound = function(seasonId, uid) {
    var eventEmitter = new EventEmitter();        
    
    var parallelQuery = db.executeQueries([
        { query: sql.picksForCurrentRound, params: [uid, seasonId], name: 'picks'},        
        { query: sql.firstLastRounds, params: [seasonId], name: 'firstLastRounds'}]);
    
    parallelQuery.on('error', function(err) {
       eventEmitter.emit('error', err);
    });
    
    parallelQuery.on('end', function(results) {    
        var response = buildRetrievePicksResponse(results, seasonId);
        
        eventEmitter.emit('end', response);
    });    
    
    return eventEmitter;
};

exports.retrievePicksFor = function(criteria) {
    var eventEmitter = new EventEmitter();        
    
    var parallelQuery = db.executeQueries([
        { query: sql.picks, params: [criteria.uid, criteria.round, criteria.seasonId], name: 'picks'},        
        { query: sql.firstLastRounds, params: [criteria.seasonId], name: 'firstLastRounds'}]);
    
    parallelQuery.on('error', function(err) {
       eventEmitter.emit('error', err);
    });
    
    parallelQuery.on('end', function(results) {            
        var response = buildRetrievePicksResponse(results, criteria.seasonId);
        
        eventEmitter.emit('end', response);
    });    
    
    return eventEmitter;
};

var buildRetrievePicksResponse = function (results, seasonId) {
    var validResponse = results.picks.rowCount > 0;
        var round = validResponse ? results.picks.rows[0].round : 0;
        var response = { 
            round: {
                games: buildGamesCollection(results.picks.rows),
                id: validResponse ? round : 0,
                text: validResponse ? results.picks.rows[0].roundtext : 'Invalid round',
                navigation: getPicksNavigationUri(results.firstLastRounds.rows[0], seasonId, round)
            },
            season : {
                name: validResponse ? results.picks.rows[0].seasonname : 'Invalid season'
            }
        }; 
        
        return response;
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
    
    var uriCollection = {
        previousUri: isValidFirstRound ? 
            buildPicksNavigationUri(season, selectedRoundInt - 1) : null,
        nextUri: isValidLastRound ?
            buildPicksNavigationUri(season, selectedRoundInt + 1) : null
    };
    
    return uriCollection;
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
    
    var query = db.executeUpsert(sql.savePick, 
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

    var query = db.executeQuery(sql.createUser,
        [criteria.uid, criteria.facebookId]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};























