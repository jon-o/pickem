var config = require('../Config.js');
var pg = require('pg');
var EventEmitter = require("events").EventEmitter;

exports.executeQuery = function(userQuery, params) {
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
    pg.connect(config.databaseConnectionString, function(err, client, done) {
         if (err) {
             eventEmitter.emit('error', err);
         } else {
             var query = client.query(userQuery, params);
             
             query.on('error', function(err) {
                 eventEmitter.emit('error', err);
             });
             
             query.on('row', function(row, result) {
                 result.addRow(row);
                 
                 eventEmitter.emit('row', row);
             });
             
             query.on('end', function(result) {
                eventEmitter.emit('end', result);
             });
             
             done();
         }
    });
    
    return eventEmitter;
};