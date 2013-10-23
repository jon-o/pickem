'use strict';

pickem.controller('LeaderboardController',
    function LeaderboardController($scope, pickemService, $rootScope, $location) {
        
        var initialize = function () {
            if (!$rootScope.login) {
                $location.path('/login');
            } else {
                pickemService.leaderboard.getForSeason(1)
                    .then(function(data) {
                        $scope.showInLeaderboard = data.showInLeaderboard;
                        $scope.leaderboard = data.leaderboard;
                    });
            }
        };
        
        $scope.updateShowInLeaderboard = function() {
            pickemService.leaderboard.updateShowInLeaderboardSetting(
                $scope.showInLeaderboard);
        };
        
        initialize();
    }
);