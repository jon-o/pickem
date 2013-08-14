'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService) {            
        $scope.selectedRound = pickemService.rounds.getCurrentRoundGames();             
        
        $scope.selectedRound.then(function(response) {
            if(response.valid) {
                $scope.games = response.round.games;
                $scope.roundTitle = response.season.name + ' ' + response.round.text;
                $scope.errorMessage = '';
            } else {
                $scope.errorMessage = handleError(response.message);
            }
        });
    }
);

var handleError = function (errorMessage) {
    return 'Oooops...something went wrong - ' + errorMessage;
};