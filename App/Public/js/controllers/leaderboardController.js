'use strict';

pickem.controller('LeaderboardController',
    function LeaderboardController($scope, pickemService) {
        $scope.model = pickemService.leaderboard.getForSeason(1);
    }
);