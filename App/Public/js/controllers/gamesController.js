'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService, sharedService) {
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
                        displaySuccessPickNotification(game);                        
                }, function() {                    
                        displayErrorPickNotification(game);
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
                sharedService.errorHandler.handleError(response.message);
            }
        };
        
        var displaySuccessPickNotification = function (game) {
            sharedService.notifier.successfulNotification(
                buildGameName(game), 'Pick Saved: ' + determinePickName(game));
        };
        
        var displayErrorPickNotification = function (game) {
                sharedService.notifier.unsuccessfulNotification(
                    buildGameName(game) + ' - Please try again', 'Pick not saved: ' + determinePickName(game));
        };
        
        var buildGameName = function (game) {
            return game.home + ' vs ' + game.away;
        };
        
        var determinePickName = function (game) {
            switch (game.pick.toLowerCase())
            {
                case 'home':
                    return game.home;
                case 'away':
                    return game.away;
                default:
                    return "Draw";
            }
        };
    }
);
