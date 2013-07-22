var service = require("./Service.js");

exports.findPicksForRound = function (req, res) {        
    var criteria = {
      seasonId: req.params.seasonId,
      round: req.params.round,
      uid: 'test'
    };
    
    var task = service.retrievePicksFor(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
        if (result) {
            res.format({            
                json: function() { res.send(result); }            
            });
        } else {
            res.send(404, 'Not found');
        }    
    });
};

exports.findPicksForCurrentRound = function (req, res) {                
    var task = service.retrivePicksForCurrentRound(req.params.seasonId, 'test');
    
    task.on('error', function(err) {
        handleError(err, res);        
    });
    
    task.on('end', function(result) {
        if (result) {
            res.format({            
                json: function() { res.send(result); }            
            });
        } else {
            res.send(404, 'Not found');
        }    
    });
};

exports.savePick = function(req, res) {
    var criteria = {
        gameId: req.body.id,
        pick: req.body.pick,
        uid: 'test'
    };
    
    var task = service.savePick(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
       res.send(200);
    });
};

var handleError = function (err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
};