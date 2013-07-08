var service = require("./Service.js");

exports.findPicksForRound = function (req, res) {        
    var criteria = {
      seasonId: req.params.seasonId,
      roundId: req.params.roundId,
      uid: 'test'
    };
    
    var games = service.retrievePicksFor(criteria);
    
    games.on('error', function(err) {
        console.log('ERROR:');
        console.log(err); 
    });
    
    games.on('end', function(result) {
        if (result) {
            res.format({            
                json: function() { res.send(result); }            
            });
        } else {
            res.send(404, 'Not found');
        }    
    });
};