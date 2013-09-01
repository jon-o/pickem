'use strict';

pickem.controller('LoginController',
    function LoginController($scope, $rootScope, $location, facebookService, pickemService, 
        sharedService) {
            
        $scope.loginVisible = false;
        $scope.loginEnabled = false;
        
        $scope.login = function() {
            $scope.loginEnabled = false;
            authenticate();
        };
        
        var authenticate = function() {
            facebookService.login()
                .then(function(fbResponse) {
                    //Sign into our api and send user data from FB
                    pickemService.login(fbResponse)
                        .then(function(apiResponse) {
                            $rootScope.isLoggedIn = true;
                            $location.path('/games');
                        }, function(apiResponse) {
                            //Something went wrong with the login to our API
                            enableLoginButton();
                            sharedService.errorHandler.handleError(
                                "Unsuccessful attempt to login to Pickem.");
                        }
                    );
                }, function(fbResponse) {
                    //Something went wrong with the login to FB
                    enableLoginButton();
                    sharedService.errorHandler.handleError(
                        "Unsuccessful attempt to login to Facebook.");
                }
            );
        };
        
        var enableLoginButton = function() {
            $scope.loginVisible = true;
            $scope.loginEnabled = true;
        };
        
        authenticate();
    }
);