var service = require("./Service.js");

exports.findPicksForRound = function (req, res) {
    var validationResponse = validateNumeric(
        [req.params.seasonId, req.params.round]);
    if (validationResponse.valid === false) {                
        return res.format({ 
            json: function() { res.send(validationResponse)}            
        });
    }
    
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
    var validationResponse = validateNumeric([req.params.seasonId]);
    if (validationResponse.valid === false) {                
        return res.format({ 
            json: function() { res.send(validationResponse)}            
        });
    }  
    
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

var validateNumeric = function (valuesToValidate) {
    var validationResponse = {
        valid: true,
        message: 'Invalid request' 
    };
    
    valuesToValidate.forEach(function (value) {
        if (!/^\s*(\+|-)?\d+\s*$/.test(value)) {            
            validationResponse.valid = false;             
        }
    });
    
    return validationResponse;
};