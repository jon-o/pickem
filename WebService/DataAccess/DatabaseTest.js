var db = require('./Database.js');

// var query = db.executeQuery('SELECT * FROM games WHERE Id = 1 OR Id = 2');
var query = db.executeQuery('SELECT * FROM games WHERE Id = $1 OR Id = $2', [1, 2]);

query.on('err', function(err) {
    console.log('ERROR: ');
    console.log(err);
});

query.on('row', function(row) {
    console.log('DATA!!!!');
    console.log(row);
});

query.on('end', function(result) {
    console.log('END: ' + result.rowCount);
});