'use strict';

pickem.controller('LoginController',
    function LoginController($scope, facebookService, pickemService) {
        facebookService.login()
            .then(function(fbResponse) {
                //Sign into our api and send user data from FB
                pickemService.login(fbResponse)
                    .then(function(apiResponse) {
                        alert(apiResponse);
                    }, function(apiResponse) {
                        //Something went wrong with the login to our API
                        alert(apiResponse);
                    }
                );
            }, function(fbResponse) {
                //Something went wrong with the login to FB
            }
        );
    }
);