'use strict';

var pickem = angular.module('pickem', ['$strap.directives'])
    .config(['$routeProvider', function($routeProvider) {
        
    $routeProvider
        .when('/login', { templateUrl: 'partials/login-partial.html' })
        .when('/games', { templateUrl: 'partials/games-partial.html' })
        .when('/leaderboard', { templateUrl: 'partials/leaderboard-partial.html' })
        .otherwise({ redirectTo: '/games' });
    }]);