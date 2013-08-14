'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService) {            
        $scope.selectedRound = pickemService.rounds.getCurrentRoundGames(1);             
        
        $scope.selectedRound.then(function(response) {
            if(response.valid) {
                $scope.games = response.round.games;
                $scope.roundTitle = response.season.name + ' ' + response.round.text;
                $scope.errorMessage = '';
            } else {
                $scope.errorMessage = handleError(response.message);
            }
        });
        
        $scope.nextRound = function () {
            alert('Next clicked!');
        };
        
        $scope.previousRound = function () {
            alert('Previous clicked!')  ;
        };
    }
);

var handleError = function (errorMessage) {
    return 'Oooops...something went wrong - ' + errorMessage;
};