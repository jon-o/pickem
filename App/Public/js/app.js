'use strict';

var pickem = angular.module('pickem', [])
    .config(['$routeProvider', function($routeProvider) {
        
    $routeProvider
        .when('/games', { templateUrl: 'partials/games-partial.html',
            }
        )
        .otherwise({ redirectTo: '/games' });
    }]);