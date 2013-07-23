var db = require('./DataAccess/Database.js');
var sql = require('./DataAccess/Sql.js');
var EventEmitter = require('events').EventEmitter;

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