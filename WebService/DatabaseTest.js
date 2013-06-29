var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'mysql10.000webhost.com',
  user     : 'api',
  password : 'lGmvdk29943',
  database : 'a9885975_pickem'
});
console.log('Connection created');

connection.connect(function(err) {
    console.log(err);
});
console.log('Connected!');

connection.query('SELECT 1 AS solution', function(err, rows, fields) {
  if (err) {
      console.log(err);
  } else {
    console.log('The solution is: ', rows[0].solution);
  }
});

connection.end();