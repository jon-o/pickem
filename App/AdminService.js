var db = require('./MySqlDataAccess/Database.js');
var sql = require('./MySqlDataAccess/Sql.js');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

exports.getSeasons = function() {
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQuery(sql.getSeasons);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};

exports.getRounds = function(criteria) {
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQuery(sql.getRounds, [criteria.seasonId]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};

exports.getGames = function(criteria) {
    var eventEmitter = new EventEmitter();
    
    var query = db.executeQuery(sql.getGames, [criteria.round]);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};

exports.updateGames = function(criteria) {
    var eventEmitter = new EventEmitter();
    
    var updates = _.map(criteria.games, function(game) {
        var result = game.result === '' ? null : game.result;
        var score = game.score === '' ? null : game.score;
        
        return {
            query: sql.updateGame,
            params: [game.date, result, score, game.id],
            name: game.id.toString()
        };
    });
    
    var query = db.executeQueries(updates);

    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {
        eventEmitter.emit('end', result);        
    });
    
    return eventEmitter;
};