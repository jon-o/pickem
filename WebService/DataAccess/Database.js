var pg = require('pg');
var EventEmitter = require("events").EventEmitter;

var connectionString = "postgres://ompghsnxlbxgmh:ejH5TfPj0KZgvWS1S_1Pceg2F2@ec2-54-235-155-182.compute-1.amazonaws.com:5432/d6fnutu4e6n5cl";

exports.executeQuery = function(userQuery) {
    var eventEmitter = new EventEmitter();
    
    eventEmitter.emit('Start');
    
    pg.connect(connectionString, function(err, client, done) {
         if (err) {
             eventEmitter.emit('error', err);
         } else {
             var query = client.query(userQuery);
             
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