var db = require('./MySqlDataAccess/Database.js');
var sql = require('./MySqlDataAccess/Sql.js');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
require('datejs');


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
    var validResponse = results.picks.length > 0;
    var response = {};
    
    if (validResponse) {
        var round = results.picks[0].round;
        var games = buildGamesCollection(results.picks);
        
        var score = _.countBy(games, function(game) {
            return game.isCorrect ? "correct" : "incorrect";
        });
        score.incorrect = score.incorrect || 0;
        score.correct = score.correct || 0;
        
        response = {
            valid: true,
            round: {
                games: games,
                id: round,
                text: results.picks[0].roundtext,
                navigation: getPicksNavigationUri(results.firstLastRounds[0], seasonId, round),
                score: score
            },
            season : {
                name: results.picks[0].seasonname
            }
        };    
    } else {
        response = { 
            valid: false,
            message: 'Invalid seasonId / round' };
    }
        
    return response;
};

var buildGamesCollection = function (games) {
    var currentDateTime = new Date();
    
    var gamesCollection = _.map(games, function(game) {
        var gameDateTime = Date.parse(game.dateandtime);
        
        var isCorrect = false;
        if (game.score != null && game.pick == game.result) {
            isCorrect = true;
        }
        
        return {
            date: game.dateandtime,
            home: game.home,
            away: game.away,
            pick: game.pick,
            allowDraw: game.allowdraw,
            score: game.score,
            id: game.id,
            hasBegun: (gameDateTime < currentDateTime) ? true : false,
            isCorrect: isCorrect
        };
    });
    
    return gamesCollection;
};

var getPicksNavigationUri = function (firstLastRounds, season, selectedRound) {
    var selectedRoundInt = parseInt(selectedRound, 10);
    var validSeasonId = firstLastRounds.firstRound !== null;
    
    var isValidFirstRound = (validSeasonId && selectedRoundInt !== parseInt(firstLastRounds.firstRound, 10));
    var isValidLastRound = (validSeasonId && selectedRoundInt !== parseInt(firstLastRounds.lastRound, 10));    
    
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
    
    var gameQuery = db.executeQuery(sql.getGame, [criteria.gameId]);

    gameQuery.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    gameQuery.on('end', function(result) {
        var currentDate = new Date();
        var gameStart = Date.parse(result[0].dateandtime).add(2).minutes();
        
        if (gameStart.isAfter(currentDate)) {
            var query = db.executeQuery(sql.savePick, 
                [criteria.uid, criteria.gameId, criteria.pick]);
        
            query.on('error', function(err) {        
                eventEmitter.emit('error', err);
            });
            
            query.on('end', function(result) {
                eventEmitter.emit('end', result);        
            });
        } else {
            eventEmitter.emit('error', { error: 'Game has already started.' });
        }
    });
    return eventEmitter;
};

exports.getLeaderboardForSeason = function(criteria) {
    console.log(util.format('GetLearderboardForSeason: UID: %s; Season: %d',
        criteria.uid, criteria.seasonId));
    
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQueries([
        { query: sql.getLeaderboardForSeason, params: [criteria.seasonId], name: 'leaderboard'},        
        { query: sql.getUser, params: [criteria.uid], name: 'user'}]);
        
    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        var leaderboard = _.map(result.leaderboard, function(item, key) {
            var isUser = item.thirdpartyid == criteria.uid ? true : false;
            
            var imageUrl = "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif";
            var name = "Private";
            if (item.showinleaderboard || isUser) {
                imageUrl = util.format("https://graph.facebook.com/%s/picture", item.facebookid);
                name = item.name;
            }
            
            return {
                position: key + 1,
                correctPicks: item.correctpicks,
                imageUrl: imageUrl,
                name: name,
                isUser: isUser
            };
        });

        var showInLeaderboard = result.user[0].showinleaderboard === 0 ? false : true;
        
        eventEmitter.emit('end', { 
            leaderboard: leaderboard, 
            showInLeaderboard: showInLeaderboard });        
    });
    
    return eventEmitter;
};

exports.saveUser = function(criteria) {
    console.log(util.format(
        'SaveUser: UID: %s; FacebookId: %s; FacebookUsername: %s; Name: %s', 
        criteria.uid, criteria.facebookId, criteria.facebookUsername, criteria.name));
    
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQueries([
        { 
            query: sql.saveUserUpdate, 
            params: [criteria.facebookUsername, criteria.name, criteria.uid], 
            name: 'saveUserUpdate' },
        { 
            query: sql.saveUserInsert, 
            params: [criteria.uid, criteria.facebookUsername, criteria.facebookId, criteria.name, 
                criteria.uid], 
            name: 'saveUserInsert' }
    ]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};

exports.updateShowInLeaderboardSetting = function(criteria) {
    var showInLeaderboard = criteria.showInLeaderboard ? 1 : 0;
    
    console.log(util.format('UpdateUser: UID: %s; ShowInLeaderboard: %d', 
        criteria.uid, showInLeaderboard));
        
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQuery(sql.updateShowInLeaderboardSetting,
        [showInLeaderboard, criteria.uid]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};