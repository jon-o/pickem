var express = require("express");
var path = require("path");
//var games = require("./Routes/Games.js");
var controller = require("./Controller.js");

var app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'Public')));
    app.use(express.bodyParser());
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

app.get('/api/picks/season/:seasonId/round/:roundId', controller.findPicksForRound);

app.post('/api/picks/save', controller.savePick);

app.listen(process.env.PORT, process.env.IP);

console.log("PickEm running...");