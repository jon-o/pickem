var util = require('util');


exports.picksForCurrentRound = util.format('%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s',
'SELECT g.dateandtime AS DateAndTime, t1.name AS Home, t2.name AS Away, p.pick AS Pick, s.allowdraw AS AllowDraw,', 
'g.score AS Score, g.id AS Id, r.text AS RoundText, sea.name AS SeasonName, r.round AS round',
'FROM games g',
'JOIN teams t1 ON g.hometeamid = t1.id',
'JOIN teams t2 ON g.awayteamid = t2.id',
'JOIN rounds r ON g.roundid = r.id',
'JOIN seasons sea on r.seasonId = sea.id',
'JOIN leagues l ON sea.leagueId = l.id',
'JOIN sports s ON l.sportid = s.id',
'LEFT JOIN users u ON u.thirdpartyid = $1',
'LEFT JOIN Picks p ON g.Id = p.GameId AND p.UserId = u.Id',
'WHERE g.RoundId = (',
'    SELECT id',
'    FROM rounds',
'    WHERE roundstartdate <= NOW()',
'    AND seasonid = $2',
'    ORDER BY roundstartdate DESC',
'    LIMIT 1)',
'ORDER BY dateandtime;');

exports.picks = util.format('%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s',
'SELECT g.dateandtime AS DateAndTime, t1.name AS Home, t2.name AS Away, p.pick AS Pick,',
's.allowdraw AS AllowDraw, g.score AS Score, g.id AS Id, r.text AS RoundText, sea.name AS SeasonName',
'FROM games g',
'JOIN teams t1 ON g.hometeamid = t1.id',
'JOIN teams t2 ON g.awayteamid = t2.id',
'JOIN rounds r ON g.roundid = r.id',
'JOIN seasons sea on r.seasonId = sea.id',
'JOIN leagues l ON sea.leagueId = l.id',
'JOIN sports s ON l.sportid = s.id',
'LEFT JOIN users u ON u.thirdpartyid = $1',
'LEFT JOIN Picks p ON g.Id = p.GameId AND p.UserId = u.Id',
'WHERE g.RoundId = (',
'    SELECT id',
'    FROM Rounds',
'    WHERE Round = $2',
'    AND SeasonId = $3)',
'ORDER BY dateandtime;');

exports.firstLastRounds = util.format('%s %s %s',
'SELECT MIN(Round) AS FirstRound, MAX(Round) AS LastRound',
'FROM rounds',
'WHERE SeasonId = $1');

exports.savePick = util.format('%s %s %s %s',
'UPDATE picks SET pick = $3',
'WHERE userid = (SELECT id FROM users WHERE thirdpartyid = $1) AND gameid = $2;',
'INSERT INTO picks (userid, gameid, pick) SELECT (SELECT id FROM users WHERE thirdpartyid = $1), $2, $3',
'WHERE NOT EXISTS (SELECT 1 FROM picks WHERE userid = (SELECT id FROM users WHERE thirdpartyid = $1) AND gameid = $2);');

exports.createUser = util.format('%s %s',
'INSERT INTO users (thirdpartyid, facebookid) SELECT $1, $2',
'WHERE NOT EXISTS (SELECT 1 FROM users WHERE thirdpartyid = CAST($1 AS varchar(30)))');


//*** ADMIN ***
exports.getSeasons = 'SELECT id, name FROM seasons';

exports.getRounds = util.format('%s %s %s %s',
'SELECT round, text',
'FROM rounds',
'WHERE seasonId = $1',
'ORDER BY round');

exports.getGames = util.format('%s %s %s %s %s %s %s',
'SELECT g.dateandtime, home.name AS home, away.name AS away',
'FROM games AS g',
'INNER JOIN rounds AS r ON r.id = g.roundId',
'INNER JOIN teams AS home ON home.id = g.hometeamid',
'INNER JOIN teams AS away ON away.id = g.awayteamid',
'WHERE r.round = $1',
'ORDER BY dateandtime');