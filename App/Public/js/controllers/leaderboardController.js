'use strict';

pickem.controller('LeaderboardController',
    function LeaderboardController($scope, pickemService) {
        $scope.leaderboard = pickemService.leaderboard.getForSeason(1);
    }
);