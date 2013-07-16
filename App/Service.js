var db = require('./DataAccess/Database.js');
var util = require('util');
var EventEmitter = require("events").EventEmitter;


exports.retrievePicksFor = function (criteria) {    
    console.log("seasonId: " + criteria.seasonId);
    console.log("roundId: " + criteria.roundId);
    console.log("uid: " + criteria.uid);
    
    var eventEmitter = new EventEmitter();
    
    
    eventEmitter.emit('Start');
    
    var query = db.executeQuery(
'SELECT g.dateandtime AS DateAndTime, t1.name AS Home, t2.name AS Away, p.pick AS Pick, s.allowdraw AS AllowDraw, g.score as Score, g.id as Id ' +
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
'	WHERE Round = $2 ' +
'	AND SeasonId = $3) ' +
'ORDER BY dateandtime;', [criteria.uid, criteria.roundId, criteria.seasonId]);
    
    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {        
        eventEmitter.emit('end', result.rows);        
    });
    
    return eventEmitter;
};

exports.savePick = function(criteria) {
    console.log(util.format('SavePick: UID: %s; GameId: %d; Pick: %s',
        criteria.uid, criteria.gameId, criteria.pick));
    
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
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
    
    eventEmitter.emit('start');

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























