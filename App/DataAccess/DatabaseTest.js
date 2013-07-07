var db = require('./Database.js');

// var query = db.executeQuery('SELECT * FROM games WHERE Id = 1 OR Id = 2');
var query = db.executeQuery('SELECT * FROM games WHERE Id = $1 OR Id = $2', [1, 2]);

query.on('error', function(err) {
    console.log('ERROR: ');
    console.log(err);
});

query.on('row', function(row) {
    console.log('DATA!!!!');
    console.log(row);
    console.log(JSON.stringify(new Date(row.dateandtime)));
});

query.on('end', function(result) {
    console.log('END: ' + result.rowCount);
});