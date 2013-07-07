var repository = require("./Repository.js");

exports.findPicksForRound = function (req, res) {
    var games = repository.findGames();
    
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