var config = require('../Config.js');
var mysql = require('mysql');
var async = require('async');
var EventEmitter = require("events").EventEmitter;

var pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    timezone: 'UTC'//,
    //multipleStatements: true
});

exports.executeQuery = function(query, params) {
    var eventEmitter = new EventEmitter();
    
    pool.getConnection(function(err, connection) {
        if (err) {
            eventEmitter.emit('error', err);
        }
    //var connection = mysql.createConnection(getConnectionSettings());
    
        connection.query(query, params, function(err, rows) {
            if (err) {
                eventEmitter.emit('error', err);
            } else {
                eventEmitter.emit('end', rows);
            }
            
            connection.end();
        });
    });
    
    return eventEmitter;
};

exports.executeQueries = function(queries) {
    var eventEmitter = new EventEmitter();
    
    var tasks = createTasks(queries, pool);
    
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

var createTasks = function(queries, pool) {
    var tasks = [];
    var position = 0;
    
    queries.forEach(function(query) {
        tasks[position] = function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    callback(err, query.name);
                }
            
                connection.query(query.query, query.params, function(err, rows) {
                    if (err) {
                        callback(err, query.name);
                    } else {
                        callback(null, { name: query.name, result: rows });
                    }
                    
                    connection.end();
                });
            });
        };
        
        position++;
    });
    
    return tasks;
};