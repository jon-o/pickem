var db = require('./DataAccess/Database.js');
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