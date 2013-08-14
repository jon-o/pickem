'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService) {
        var previousRoundUri;
        var nextRoundUri;
        
        $scope.selectedRound = pickemService.rounds.getCurrentRoundGames(1);             
        
        $scope.selectedRound.then(function(response) {
            if(response.valid) {
                $scope.games = response.round.games;
                $scope.roundTitle = response.season.name + ' ' + response.round.text;
                previousRoundUri = response.round.navigation.previousUri;
                nextRoundUri = response.round.navigation.nextUri;
                $scope.errorMessage = '';
            } else {
                $scope.errorMessage = handleError(response.message);
            }
        });
        
        $scope.nextRound = function () {
            $scope.selectedRound = pickemService.rounds.getRoundGames(nextRoundUri);
            
            $scope.selectedRound.then(function(response) {
                if(response.valid) {
                    $scope.games = response.round.games;
                    $scope.roundTitle = response.season.name + ' ' + response.round.text;
                    previousRoundUri = response.round.navigation.previousUri;
                    nextRoundUri = response.round.navigation.nextUri;
                    $scope.errorMessage = '';
                } else {
                    $scope.errorMessage = handleError(response.message);
                }
            });
        };
        
        $scope.previousRound = function () {
            $scope.selectedRound = pickemService.rounds.getRoundGames(previousRoundUri);
            
            $scope.selectedRound.then(function(response) {
                if(response.valid) {
                    $scope.games = response.round.games;
                    $scope.roundTitle = response.season.name + ' ' + response.round.text;
                    previousRoundUri = response.round.navigation.previousUri;
                    nextRoundUri = response.round.navigation.nextUri;
                    $scope.errorMessage = '';
                } else {
                    $scope.errorMessage = handleError(response.message);
                }
            });        
        };
    }
);

var handleError = function (errorMessage) {
    return 'Oooops...something went wrong - ' + errorMessage;
};