'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService) {
        var previousRoundUri;
        var nextRoundUri;            
        
        $scope.selectedRound = pickemService.rounds.getCurrentRoundGames(1);             
        
        $scope.selectedRound.then(function(response) {
            processRoundResponse(response);
        });
        
        $scope.nextRound = function () {            
            performGetRoundGames(nextRoundUri);
        };
        
        $scope.previousRound = function () {        
            performGetRoundGames(previousRoundUri);
        };
        
        var performGetRoundGames = function (getRoundGamesUri) {
            $scope.selectedRound = pickemService.rounds.getRoundGames(getRoundGamesUri);
            
            $scope.selectedRound.then(function(response) {
                processRoundResponse(response);
            });
        };
        
        var processRoundResponse = function (response) {
            if(response.valid) {
                $scope.games = response.round.games;
                $scope.roundTitle = response.season.name + ' ' + response.round.text;
                $scope.errorMessage = '';
                
                previousRoundUri = response.round.navigation.previousUri;
                nextRoundUri = response.round.navigation.nextUri;                
            } else {
                $scope.errorMessage = handleError(response.message);
            }
        };        
    }
);

var handleError = function (errorMessage) {
    return 'Oooops...something went wrong - ' + errorMessage;
};

