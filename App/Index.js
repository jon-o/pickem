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

var apiAuth = function(req, res, next) {
    if (req.session.uid != null) {
        next();
    } else {
        if (config.authenticateApi == null || config.authenticateApi == false) {
            req.session.uid = 'test';
            next();
        } else {
            res.setHeader('WWW-Authenticate', 'realm="My realm"');
            res.send(401, 'Not logged in.');
        }
    }
};

var adminAuth = express.basicAuth(config.adminUser, config.adminPassword);

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/Views');
    app.use(express.static(path.join(__dirname, 'Public')));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: config.sessionSecret }));
    app.use(app.router); //Enable error handling
    app.use(notFoundHandler); //If no routes match, this will be called
    app.use(errorHandler); //Express knows a method with 4 params, is for handling errors
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});

//*** API ***
app.post('/api/login', controller.login);
app.get('/api/picks/season/:seasonId/round/:round', apiAuth, controller.findPicksForRound);
app.get('/api/picks/season/:seasonId', apiAuth, controller.findPicksForCurrentRound);
app.post('/api/picks', apiAuth, controller.savePick);
app.get('/api/leaderboard/season/:seasonId', apiAuth, controller.getLeaderboardForSeason);
app.post('/api/user/showInLeaderboard', apiAuth, controller.updateShowInLeaderboardSetting);

//*** ADMIN ***
app.get('/admin', adminAuth, adminController.showSeasons);
app.get('/admin/season/:seasonId', adminAuth, adminController.showRounds);
app.get('/admin/season/:seasonId/round/:round', adminAuth, adminController.showGames);
app.post('/admin/season/:seasonId/round/:round', adminAuth, adminController.updateGames);

app.listen(process.env.PORT, process.env.IP);

console.log("PickEm running...");