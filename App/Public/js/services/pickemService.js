'use strict';

pickem.factory('pickemService', function($q, $http) {
    return {
        rounds: {
            getCurrentRoundGames: function (seasonId) {
                var deferred = $q.defer();
                
                $http({method: 'GET', url: '/api/picks/season/' + seasonId})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                       deferred.reject(status); 
                    });
                    
                return deferred.promise;
            },
            
            getRoundGames: function (apiUrl) {
                var deferred = $q.defer();
                
                $http({method: 'GET', url: apiUrl})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                       deferred.reject(status); 
                    });
                    
                return deferred.promise;
            }
        },        
        
        leaderboard: {
            getForSeason: function(seasonId) {
                var deferred = $q.defer();
                
                $http({ 
                    method: 'GET', 
                    url: '/api/leaderboard/season/' + seasonId })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data, status) {
                    deferred.reject(status);
                });
                
                return deferred.promise;
            },
            
            updateShowInLeaderboardSetting: function(value) {
                alert(value);
                
                $http({
                    method: 'POST',
                    url: '/api/user/showInLeaderboard',
                    data: { 'showInLeaderboard': value }
                })
                .success(function(data) {
                    //Do nothing
                })
                .error(function(data, status) {
                    //Need to handle this
                    alert('Unable to update at this time');
                });
            }
        }
    };
});