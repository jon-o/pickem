'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService, sharedService, $location, $rootScope) {
        var previousRoundUri;
        var nextRoundUri;          
        
        var initialize = function () {
            if (!$rootScope.login) {
                $location.path('/login');
            } else {
                $scope.selectedRound = pickemService.rounds.getCurrentRoundGames(1);             
            
                $scope.selectedRound.then(function(response) {
                    processRoundResponse(response);
                });
            }
        };
        
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
                }, function() {
                    sharedService.notifier.unsuccessfulNotification(
                        'Please try again', 'Error navigating to round');
                });
            }
        };
        
        var processRoundResponse = function (response) {
            if(response.valid) {
                $scope.games = buildGameViewModels(response.round.games);
                $scope.roundTitle = response.season.name + ' ' + response.round.text;
                $scope.errorMessage = '';
                $scope.score = response.round.score;
                
                previousRoundUri = response.round.navigation.previousUri;
                nextRoundUri = response.round.navigation.nextUri;                
            } else {
                sharedService.errorHandler.handleError(response.message);
            }
        };
        
        var buildGameViewModels = function (games) {
              var gameViewModels = [];
              
              games.forEach(function(game) {
                  gameViewModels.push(new GameViewModel(game));
              });
              
              return gameViewModels;
        };
        
        var displaySuccessPickNotification = function (game) {
            sharedService.notifier.successfulNotification(
                game.name, 'Pick Saved: ' + game.getPickName());
        };
        
        var displayErrorPickNotification = function (game) {
            sharedService.notifier.unsuccessfulNotification(
                game.name + ' - Please try again', 'Pick not saved: ' + game.getPickName());
        };
        
        initialize();
    }
);
