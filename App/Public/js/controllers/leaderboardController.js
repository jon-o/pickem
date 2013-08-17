'use strict';

pickem.controller('LeaderboardController',
    function LeaderboardController($scope, pickemService) {
        pickemService.leaderboard.getForSeason(1)
            .then(function(data) {
                $scope.setting = data.showInleaderboard;
                $scope.leaderboard = data.leaderboard;
            })
        
        $scope.updateSetting = function() {
            pickemService.leaderboard.updateShowInLeaderboardSetting(
                $scope.setting);
        };
    }
);