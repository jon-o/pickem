var config = require('../Config.js');
var mysql = require('mysql');
var fs = require('fs');
var byline = require('byline');
var _ = require('underscore');
var path = require('path');
var util = require('util');
require('datejs');

var sourceFilePath = path.join(__dirname, 'Games.txt');
var sourceTimeZone = "PST";
var roundId = 6;

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
        handleError(err, connection);
    } else {
        var teams = rows;
        var insertStatement = 
            'INSERT INTO games (DateAndTime, HomeTeamId, AwayTeamId, Result, RoundId, Score) VALUES';
        
        var stream = fs.createReadStream(sourceFilePath);
        stream = byline.createStream(stream);
        
        var first = true;
        
        stream.on('data', function(line) {
            var fields = line.toString().split('\t');
            
            //var date = Date.parse(fields[1] + sourceTimeZone);
            var date = parseDate(fields[1], sourceTimeZone);
            var homeTeam = getTeam(teams, fields[2]);
            var awayTeam = getTeam(teams, fields[3]);
            
            var insertValues = util.format("('%s', %d, %d, NULL, %d, NULL)", 
                date.toISOString(), homeTeam.id, awayTeam.id, roundId);
            
            insertStatement = util.format('%s%s\n%s', insertStatement, !first ? ',' : '', insertValues);
            
            first = false;
        });
        
        stream.on('end', function() {
            console.log(insertStatement);
            connection.query(insertStatement, function(err, rows) {
                if (err) {
                    handleError(err, connection);
                } else {
                    connection.query('SELECT * FROM games WHERE roundId = ' + roundId, 
                        function(err, rows) {
                            if (err) {
                                handleError(err, connection);
                            } else {
                                console.log(rows);
                            }
                            connection.destroy();
                        }
                    );
                }
           });
        });
    }
});

var parseDate = function(source, timezone) {
    var slashSplit = source.split('/');
    var spaceSplit = slashSplit[2].split(' ');
    
    var day = slashSplit[0];
    var month = slashSplit[1];
    var year = spaceSplit[0];
    var time = spaceSplit[1];
    
    var dateString = util.format("%d-%d-%d %s %s",
        year, month, day, time, timezone);
    var date = Date.parse(dateString);
    
    return date;
};

var getTeam = function(teams, name) {
    var team = _.find(teams, function(team) {
        return team.name == name;
    });
    
    return team;
};

var handleError = function(err, connection) {
    connection.destroy();
    
    console.log("**Error**");
    console.log(err);
};