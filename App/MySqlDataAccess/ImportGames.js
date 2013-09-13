var config = require('../Config.js');
var mysql = require('mysql');
var fs = require('fs');
var util = require('util');
var byline = require('byline');
var _ = require('underscore');
var path = require('path');

var sourceFilePath = path.join(__dirname, 'Games.txt');

var connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    timezone: 'UTC',
    multipleStatements: true
});

connection.query('SELECT Id AS id, Name as name FROM teams', function (err, rows) {
    if (err) {
        console.log("**Error**");
        console.log(err);
    } else {
        var teams = rows;
        
        var stream = fs.createReadStream(sourceFilePath);
        stream = byline.createStream(stream);
        
        stream.on('end', function() {
           console.log('FINISHED');
        });
        
        var first = true;
        
        stream.on('data', function(line) {
            var fields = line.toString().split('\t');
            
            console.log(getTeam(teams, fields[2]));
            console.log(getTeam(teams, fields[4]));
            
            first = false;
        });
    }
    connection.destroy();
});

var getTeam = function(teams, name) {
    var team = _.find(teams, function(team) {
        return team.name == name;
    });
    
    return team;
};