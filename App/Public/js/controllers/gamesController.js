'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService) {
        $scope.message = 'Booya!'
        
        $scope.selectedRound = pickemService.getCurrentRoundGames();
    }
);