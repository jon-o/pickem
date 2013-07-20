var service = require("./Service.js");

exports.findPicksForRound = function (req, res) {        
    var criteria = {
      seasonId: req.params.seasonId,
      roundId: req.params.roundId,
      uid: 'test'
    };
    
    var picks = service.retrievePicksFor(criteria);
    
    picks.on('error', function(err) {
        console.log('ERROR:');
        console.log(err); 
    });
    
    picks.on('end', function(result) {
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
    var picks = service.retrivePicksForCurrentRound(req.params.seasonId, 'test');
    
    picks.on('error', function(err) {
        console.log('ERROR:');
        console.log(err); 
    });
    
    picks.on('end', function(result) {
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

function handleError(err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
}