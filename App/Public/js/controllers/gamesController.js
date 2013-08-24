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
        
        $scope.sendPick = function (game, pick) {
            if (pick != game.pick) {
                var previousPick = game.pick;
                game.pick = pick;
                
                pickemService.pick.savePick(game.id, pick)
                    .then(function() {                        
                        toastr.success(game.home + ' vs ' + game.away, 'Pick Saved: ' + game.pick.toUpperCase());                        
                }, function() {                    
                        toastr.error(game.home + ' vs ' + game.away, 'Pick not saved: ' + game.pick.toUpperCase());
                        game.pick = previousPick;
                });
            }            
        };            
        
        var performGetRoundGames = function (getRoundGamesUri) {
            if (getRoundGamesUri !== null) {
                $scope.selectedRound = pickemService.rounds.getRoundGames(getRoundGamesUri);
                
                $scope.selectedRound.then(function(response) {
                    processRoundResponse(response);
                });
            }
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

