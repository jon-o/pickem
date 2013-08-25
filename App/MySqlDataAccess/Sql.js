var util = require('util');

exports.picksForCurrentRound = util.format('%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s',
'SELECT g.dateandtime AS dateandtime, t1.name AS home, t2.name AS away, p.pick AS pick, s.allowdraw AS allowdraw,', 
'g.score AS score, g.id AS id, r.text AS roundtext, sea.name AS seasonname, r.round AS round',
'FROM games g',
'JOIN teams t1 ON g.hometeamid = t1.id',
'JOIN teams t2 ON g.awayteamid = t2.id',
'JOIN rounds r ON g.roundid = r.id',
'JOIN seasons sea on r.seasonId = sea.id',
'JOIN leagues l ON sea.leagueId = l.id',
'JOIN sports s ON l.sportid = s.id',
'LEFT JOIN users u ON u.thirdpartyid = ?',
'LEFT JOIN Picks p ON g.Id = p.GameId AND p.UserId = u.Id',
'WHERE g.RoundId = (',
'    SELECT id',
'    FROM rounds',
'    WHERE roundstartdate <= CURDATE()',
'    AND seasonid = ?',
'    ORDER BY roundstartdate DESC',
'    LIMIT 1)',
'ORDER BY dateandtime;');

exports.picks = util.format('%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s',
'SELECT g.dateandtime AS dateandtime, t1.name AS home, t2.name AS away, p.pick AS pick, s.allowdraw AS allowdraw,', 
'g.score AS score, g.id AS id, r.text AS roundtext, sea.name AS seasonname, r.round AS round',
'FROM games g',
'JOIN teams t1 ON g.hometeamid = t1.id',
'JOIN teams t2 ON g.awayteamid = t2.id',
'JOIN rounds r ON g.roundid = r.id',
'JOIN seasons sea on r.seasonId = sea.id',
'JOIN leagues l ON sea.leagueId = l.id',
'JOIN sports s ON l.sportid = s.id',
'LEFT JOIN users u ON u.thirdpartyid = ?',
'LEFT JOIN Picks p ON g.Id = p.GameId AND p.UserId = u.Id',
'WHERE g.RoundId = (',
'    SELECT id',
'    FROM Rounds',
'    WHERE Round = ?',
'    AND SeasonId = ?)',
'ORDER BY dateandtime;');

exports.firstLastRounds = util.format('%s %s %s',
'SELECT MIN(Round) AS firstRound, MAX(Round) AS lastRound',
'FROM rounds',
'WHERE SeasonId = ?');

exports.savePick = util.format('%s %s %s %s',
'REPLACE INTO picks (UserId, GameId, Pick)',
'VALUES (',
'    (SELECT Id FROM Users WHERE ThirdPartyId = ?),',
'    ?, ?)');

exports.saveUser = util.format('%s %s %s %s',
'REPLACE INTO users (thirdpartyid, facebookusername, name, showinleaderboard, facebookid)',
'VALUES (?, ?, ?, ?, 0)',
'WHERE NOT EXISTS (SELECT 1 FROM users WHERE thirdpartyid = ?)');

exports.updateShowInLeaderboardSetting = util.format('%s %s %s',
'UPDATE users',
'SET showinleaderboard = ?',
'WHERE thirdpartyid = ?');

exports.getUser = util.format('%s %s %s %s',
'SELECT Id AS id, ThirdPartyId as thirdpartyid, FacebookId as facebookid,',
'    FacebookUsername AS facebookusername, Name AS name, ShowInLeaderboard AS showinleaderboard',
'FROM users',
'WHERE thirdpartyid = ?');

exports.getLeaderboardForSeason = util.format('%s %s %s %s %s %s %s %s %s %s',
'SELECT @curRow := @curRow + 1 AS position,',
'    COUNT(u.Id) AS correctpicks, u.thirdpartyid, u.facebookid,',
'    u.name, u.showinleaderboard',
'FROM picks AS p',
'JOIN (SELECT @curRow := 0) r',
'INNER JOIN games AS g on g.id = p.gameId',
'INNER JOIN rounds AS r on r.id = g.roundId',
'INNER JOIN users AS u ON u.id = p.userId',
'WHERE r.seasonId = ?',
 '   AND p.pick = g.result',
'GROUP BY u.Id');

//*** ADMIN ***
exports.getSeasons = 'SELECT id, name FROM seasons';

exports.getRounds = util.format('%s %s %s %s',
'SELECT round, text',
'FROM rounds',
'WHERE seasonId = ?',
'ORDER BY round');

exports.getGames = util.format('%s %s %s %s %s %s %s',
'SELECT g.id, DATE_FORMAT(g.dateandtime,\'%a, %e %b %Y %H:%i:%s UTC\') AS dateandtime, home.name AS home, away.name AS away, g.result, COALESCE(g.score, \'\') AS score',
'FROM games AS g',
'INNER JOIN rounds AS r ON r.id = g.roundId',
'INNER JOIN teams AS home ON home.id = g.hometeamid',
'INNER JOIN teams AS away ON away.id = g.awayteamid',
'WHERE r.round = ?',
'ORDER BY dateandtime');

exports.updateGame = util.format('%s %s %s',
'UPDATE games',
'SET result = ?, score = ?',
'WHERE id = ?');