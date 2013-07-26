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
var config = require('./Config.js');
var controller = require("./Controller.js");
var adminController = require("./AdminController.js");

var app = express();

var notFoundHandler = function(req, res) {
    res.statusCode = 404;
    res.description = 'Not found';
    res.render('notFound');
};

var errorHandler = function(err, req, res, next) {
    console.log("****ERROR****");
    console.log(err);
    
    res.statusCode = 500;
    res.description = 'Something went wrong';
    res.render('error');
};

var auth = express.basicAuth(config.adminUser, config.adminPassword);

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/Views');
    app.use(express.static(path.join(__dirname, 'Public')));
    app.use(express.bodyParser());
    app.use(app.router); //Enable error handling
    app.use(notFoundHandler); //If no routes match, this will be called
    app.use(errorHandler); //Express knows a method with 4 params, is for handling errors
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

app.get('/api/picks/season/:seasonId/round/:round', controller.findPicksForRound);
app.get('/api/picks/season/:seasonId', controller.findPicksForCurrentRound);

app.post('/api/picks', controller.savePick);

//*** ADMIN ***
app.get('/admin', auth, adminController.showSeasons);
app.get('/admin/season/:seasonId', auth, adminController.showRounds);
app.get('/admin/season/:seasonId/round/:round', auth, adminController.showGames);
app.post('/admin/season/:seasonId/round/:round', auth, adminController.updateGames);

app.listen(process.env.PORT, process.env.IP);

console.log("PickEm running...");