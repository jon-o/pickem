var config = require('../Config.js');
var mysql = require('mysql');
var fs = require('fs');

fs.readFile('./App/MySqlDataAccess/Seed.sql', function(err, data) {
    if (err) {
        console.log(err);
    } else {
        var query = data.toString();
        
        var connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database,
            timezone: 'UTC',
            multipleStatements: true
        });
        
        connection.query(query, function(err, rows) {
            if (err) {
                console.log("**Error**");
                console.log(err);
                connection.destroy();
            } else {
                connection.query('SELECT * FROM teams', function (err, rows) {
                    if (err) {
                        console.log("**Error**");
                        console.log(err);
                    } else {
                        console.log(rows);
                    }
                    connection.destroy();
                });
            }
            
            
        });
    }
});