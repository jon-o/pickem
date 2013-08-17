'use strict';

pickem.controller('LeaderboardController',
    function LeaderboardController($scope, pickemService) {
        pickemService.leaderboard.getForSeason(1)
            .then(function(data) {
                $scope.showInLeaderboard = data.showInLeaderboard;
                $scope.leaderboard = data.leaderboard;
            });
        
        $scope.updateshowInLeaderboard = function() {
            pickemService.leaderboard.updateShowInLeaderboardSetting(
                $scope.showInLeaderboard);
        };
    }
);