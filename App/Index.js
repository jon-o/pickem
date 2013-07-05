var express = require("express");
var path = require("path");

var app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'Public')));
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

app.listen(process.env.PORT, process.env.IP);