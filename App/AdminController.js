var adminService = require("./AdminService.js");

exports.showSeasons = function(req, res) {
    var task = adminService.getSeasons();
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
       res.render('seasons', { seasons: result.rows }) ;
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
        res.render('rounds', 
            { rounds: result.rows, seasonId: req.params.seasonId });
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
        res.render('games', 
            { games: result.rows, seasonId: req.params.seasonId,
            round: req.params.round}) ;
    });
};

var handleError = function(err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
};