var config = require('../Config.js');
var pg = require('pg');
var fs = require('fs');

fs.readFile('./App/DataAccess/Seed.sql', function(err, data) {
    if (err) {
        console.log(err);
    } else {
        var query = data.toString();
       
        pg.connect(config.databaseConnectionString, function(err, client, done) {
            if (err) {
                console.log('ERROR CONNECTING:');
                console.log(err);
            } else {
                client.query(query, function(err, result) {
                    if (err) {
                        console.log('ERROR WITH QUERY:');
                        console.log(err);
                        
                        done();
                    } else {
                        console.log('RETURNED result:');
                        console.log(result);
                        console.log('RETURN row:');
                        console.log(result.rows[0]);
                        
                        client.query('SELECT * FROM games', function(err, result) {
                            if (err) {
                                console.log('ERROR WITH QUERY:');
                                console.log(err);
                            } else {
                                //console.log('RETURNED result:');
                                //console.log(result);
                                console.log('RETURN row:');
                                console.log(result.rows);
                            }
                            
                            done();
                        });
                    }
                });
            }
        });
        
        // pg.connect(connectionString, function(err, client, done) {
        //     if (err) {
        //         console.log('ERROR CONNECTING:');
        //         console.log(err);
        //     } else {
        //         client.query('SELECT * FROM users', function(err, result) {
        //             if (err) {
        //                 console.log('ERROR WITH QUERY:');
        //                 console.log(err);
        //             } else {
        //                 //console.log('RETURNED result:');
        //                 //console.log(result);
        //                 console.log('RETURN row:');
        //                 console.log(result.rows);
        //             }
        //         });
        //         done();
        //     }
        // });
        
        pg.end();
    }
});

