var service = require("./Service.js");

exports.login = function (req, res) {
    if (req.body.third_party_id == null ||
        req.body.id == null ||
        req.body.name == null) {
        
        res.setHeader('WWW-Authenticate', 'realm="My realm"');
        res.send(401, { error: 'Bad credentials.' });
    } else {
        var criteria = {
            uid: req.body.third_party_id,
            facebookId: req.body.id,
            facebookUsername: req.body.username,
            name: req.body.name,
            seasonId: 1
        };
        console.log(criteria);
        
        var task = service.login(criteria);
        
        task.on('error', function(err) {
            handleError(err, res);
        });
        
        task.on('end', function(result) {
            req.session.uid = criteria.uid;
            console.log('current round id: ' + result.currentRound[0].id);
            
            //res.send(201);
            res.format({
                json: function() { res.send({ currentRoundId: result.currentRound[0].id }); }
            });
        });
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
            res.send(404, { error: 'Not found' });
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
            res.send(404, { error: 'Not found' });
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
       res.send(201);
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
        res.send(201);
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
            res.send(404, { error: 'Not found' });
        }
    });
};

var getUid = function(req) {
    console.log('Controller.getUID - Uid: ' + req.session.uid);
    
    return req.session.uid;
};

var handleError = function (err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, { error: 'Oooops...something went wrong.' });
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