'use strict';

pickem.controller('LoginController',
    function LoginController(facebookService, $scope) {
        facebookService.login()
            .then(function(response) {
                //Sign into out api and send user data from FB
            });
    }
);