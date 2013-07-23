//Setup for Nodetime add-on
if (process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Pickem' // optional
    });
}

var express = require("express");
var path = require("path");
//var games = require("./Routes/Games.js");
var controller = require("./Controller.js");
var adminController = require("./AdminController.js");

var app = express();

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/Views');
    app.use(express.static(path.join(__dirname, 'Public')));
    app.use(express.bodyParser());
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

app.get('/api/picks/season/:seasonId/round/:round', controller.findPicksForRound);
app.get('/api/picks/season/:seasonId', controller.findPicksForCurrentRound);

app.post('/api/picks', controller.savePick);

//*** ADMIN ***
app.get('/admin', adminController.showSeasons);
app.get('/admin/season/:seasonId', adminController.showRounds);

app.listen(process.env.PORT, process.env.IP);

console.log("PickEm running...");