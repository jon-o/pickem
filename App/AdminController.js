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

var handleError = function(err, res) {
    console.log("****ERROR****");
    console.log(err);
    res.send(500, "Oooops...something went wrong.");
};