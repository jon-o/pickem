var db = require('./Database.js');

var query = db.executeQuery('SELECT * FROM games WHERE Id = ? OR Id = ?', [1, 2]);

query.on('error', function(err) {
    console.log('ERROR: ');
    console.log(err);
});

query.on('end', function(result) {
    console.log('END:');
    console.log(result);
});

var parallelQuery = db.executeQueries([
    { query: 'SELECT * FROM users', params: null, name: 'users'},
    { query: 'SELECT * FROM games WHERE Id = ? OR Id = ?', params: [1, 2], name: 'games'}]);

parallelQuery.on('error', function(err) {
    console.log('ERROR: ');
    console.log(err);
});

parallelQuery.on('end', function(results) {
    console.log('***USERS***');
    console.log(results.users);
    console.log('***GAMES***');
    console.log(results.games);
});