var db = require('./DataAccess/Database.js');
var EventEmitter = require("events").EventEmitter;


exports.findGames = function () {    
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
    var query = db.executeQuery('SELECT * FROM games');
    
    query.on('error', function(err) {        
        eventEmitter.emit('error', err);
    });
    
    query.on('end', function(result) {        
        eventEmitter.emit('end', result.rows);        
    });
    
    return eventEmitter;
};