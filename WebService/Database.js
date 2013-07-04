var mysql = require('mysql');
var EventEmitter = require("events").EventEmitter;

exports.executeQuery = function(query) {
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('start');
    
    var connection = getConnection();
    // connection.query(query, function(err, rows, fields) {
    //     if (err) {
    //         eventEmitter.emit('error', err);
    //     } else {
    //         eventEmitter.emit('data', rows);
    //         eventEmitter.emit('end', rows.count);
    //     }
    // });
    var rowCount = 0;
    
    connection.query(query)
        .on('error', function(err) {
            eventEmitter.emit('error', err);
        })
        .on('result', function(result) {
            rowCount++;
            eventEmitter.emit('data', result);
        })
        .on('end', function() {
            eventEmitter.emit('end', rowCount);
        });
    
    connection.end();
    
    return eventEmitter;
};

function getConnection() {
    var connection = mysql.createConnection({
        host: 'mysql10.000webhost.com',
        user: 'api',
        password: 'lGmvdk29943',
        database: 'a9885975_pickem'
    });
    
    return connection;
}

//hello