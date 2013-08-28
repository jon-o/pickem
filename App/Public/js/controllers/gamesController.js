'use strict';

pickem.controller('GamesController', 
    function GamesController($scope, pickemService, sharedService) {
        var previousRoundUri;
        var nextRoundUri;          
        var pickSaveErrors = 0;
        
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
                $scope.errorMessage = handleError(response.message);
            }
        };
        
        var displaySuccessPickNotification = function (game) {
            sharedService.notify.successNotification(buildGameName(game), 'Pick Saved: ' + determinePickName(game));
            //toastr.success(buildGameName(game), 'Pick Saved: ' + determinePickName(game));
            
            pickSaveErrors = 0;
        };
        
        var displayErrorPickNotification = function (game) {
            if (pickSaveErrors < 3) {
                toastr.warning(buildGameName(game) + ' - Please try again', 'Pick not saved: ' + determinePickName(game));
            } else {
                toastr.error('Unable to save your pick - Please try again later', 'Oops! Something is wrong...');
            }
                            
            pickSaveErrors += 1;            
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
        }
    }
);

var handleError = function (errorMessage) {
    return 'Oooops...something went wrong - ' + errorMessage;
};

