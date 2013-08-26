var service = require("./Service.js");

exports.login = function (req, res) {
    if (req.body.third_party_id === null ||
        req.body.id === null ||
        req.body.username === null ||
        req.body.name === null) {
        
        res.send(403, 'Bad authorization credentials.');
    } else {
        console.log('Uid: ' + req.body.third_party_id);
        console.log('Id: ' + req.body.id);
        console.log('Username: ' + req.body.username);
        console.log('Name: ' + req.body.name);
        res.send(200);
    }
};

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
      uid: getUid(req)
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
    
    var task = service.retrivePicksForCurrentRound(req.params.seasonId, getUid(req));
    
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
        uid: getUid(req)
    };
    
    var task = service.savePick(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
       res.send(200);
    });
};

exports.updateShowInLeaderboardSetting = function(req, res) {
    var criteria = {
        uid: getUid(req),
        showInLeaderboard: req.body.showInLeaderboard
    };
    
    var task = service.updateShowInLeaderboardSetting(criteria);
    
    task.on('error', function(err) {
        handleError(err, res);
    });
    
    task.on('end', function(result) {
        res.send(200);
    });
};

exports.getLeaderboardForSeason = function(req, res) {
    var criteria = {
        seasonId: req.params.seasonId,
        uid: getUid(req)
    };
    
    var task = service.getLeaderboardForSeason(criteria);
    
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

var getUid = function(req) {
    return 'test';
};

var handleError = function (err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
};

var validateNumeric = function (valuesToValidate) {
    var validationResponse = {
        valid: true,
        message: '' 
    };
    
    valuesToValidate.forEach(function (value) {
        if (!/^\s*(\+|-)?\d+\s*$/.test(value)) {            
            validationResponse.valid = false; 
            validationResponse.message = 'Invalid request';
        }
    });
    
    return validationResponse;
};