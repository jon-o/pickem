var util = require("util");
var adminService = require("./AdminService.js");

exports.showSeasons = function(req, res) {
    var task = adminService.getSeasons();
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
       res.render('seasons', { seasons: result }) ;
    });
};

exports.showRounds = function(req, res) {
    var criteria = {
        seasonId: req.params.seasonId
    };
    
    var task = adminService.getRounds(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
        res.render('rounds', { 
            rounds: result, 
            seasonId: req.params.seasonId });
    });
};

exports.showGames = function(req, res) {
    var criteria = {
        round: req.params.round
    };
    
    var task = adminService.getGames(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
        res.render('games', { 
            games: result, 
            seasonId: req.params.seasonId,
            round: req.params.round });
    });
};

exports.updateGames = function(req, res) {
    var criteria = {
        games: []
    };
    
    for (var i = 0; i < req.body.count; i++) {
        var game = {
            id: req.body['id' + i],
            date: req.body['date' + i],
            result: req.body['result' + i],
            score: req.body['score' + i]
        };
        
        criteria.games.push(game);
    }
    
    var task = adminService.updateGames(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
        var redirectUrl = util.format('/admin/season/%s/round/%s', req.params.seasonId,
            req.params.round);
            
        res.redirect(redirectUrl);
    });
};

var handleError = function(err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
};