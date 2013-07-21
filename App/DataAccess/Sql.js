exports.currentRound = 
'SELECT round as Round ' +
'FROM rounds ' +
'WHERE roundstartdate <= NOW() ' +
'AND seasonid = $1 ' +
'ORDER BY roundstartdate DESC ' +
'LIMIT 1;';

exports.picks = 
'SELECT g.dateandtime AS DateAndTime, t1.name AS Home, t2.name AS Away, p.pick AS Pick, ' +
's.allowdraw AS AllowDraw, g.score as Score, g.id as Id, r.text AS RoundText, sea.name AS SeasonName ' +
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
'    AND SeasonId = $3) ' +
'ORDER BY dateandtime;';

exports.firstLastRounds = 
'SELECT MIN(Round) AS FirstRound, MAX(Round) AS LastRound ' +
'FROM rounds ' +
'WHERE SeasonId = $1';