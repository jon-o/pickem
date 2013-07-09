var config = require('../Config.js');
var pg = require('pg');
var async = require('async');
var EventEmitter = require("events").EventEmitter;

exports.executeQuery = function(userQuery, params) {
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
    pg.connect(config.databaseConnectionString, function(err, client, done) {
         if (err) {
             eventEmitter.emit('error', err);
             done(client);
         } else {
             var query = client.query(userQuery, params);
             
             query.on('error', function(err) {
                 eventEmitter.emit('error', err);
                 done(client);
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

exports.executeQueries = function(userQueries) {
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
    var tasks = createTasks(userQueries);
    
    async.parallel(tasks, function(err, results) {
        if (err) {
            eventEmitter.emit('error', err);
        } else {
            var formattedResults = {};
            
            results.forEach(function(result) {
                formattedResults[result.name] = result.result;
            });
            
            eventEmitter.emit('end', formattedResults);
        }
    });
    
    return eventEmitter;
};

function createTasks(userQueries) {
    var tasks = [];
    var position = 0;
    
    userQueries.forEach(function(userQuery) {
       tasks[position] = function(callback) {
           pg.connect(config.databaseConnectionString, function(err, client, done) {
                 if (err) {
                     done(client);
                     callback(err, query.name);
                 } else {
                     var query = client.query(userQuery.query, userQuery.params);
                     
                     query.on('error', function(err) {
                         done(client);
                         callback(err);
                     });
                     
                     query.on('row', function(row, result) {
                         result.addRow(row);
                     });
                     
                     query.on('end', function(result) {
                        callback(null, {name: userQuery.name, result: result});
                     });
                 }
                 
                 done();
            });
       };
       
       position++;
    });
    
    return tasks;
}