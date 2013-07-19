'use strict';

var pickem = angular.module('pickem', ['$strap.directives'])
    .config(['$routeProvider', function($routeProvider) {
        
    $routeProvider
        .when('/games', { templateUrl: 'partials/games-partial.html' })
        .when('/leaderboard', { templateUrl: 'partials/leaderboard-partial.html' })
        .otherwise({ redirectTo: '/games' });
    }]);