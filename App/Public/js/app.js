'use strict';

var pickem = angular.module('pickem', ['$strap.directives'])
    .config(['$routeProvider', function($routeProvider) {
        
    $routeProvider
        .when('/login', { controller: 'LoginController', templateUrl: 'partials/login-partial.html' })
        .when('/games', { controller: 'GamesController', templateUrl: 'partials/games-partial.html' })
        .when('/leaderboard', { controller: 'LeaderboardController', templateUrl: 'partials/leaderboard-partial.html'  })
        .otherwise({ redirectTo: '/games' });
    }]);