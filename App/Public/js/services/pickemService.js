'use strict';

pickem.factory('pickemService', function($q, cachedHttpService, $rootScope) {
    var isCurrentRound = function(apiUrl) {
        return ($rootScope.login.currentRound.uri == apiUrl);
    };
    
    return {
        games: {
            getByUri: function (apiUrl) {
                var deferred = $q.defer();
                var cacheDuration = 300;
                if (isCurrentRound(apiUrl)) {
                    cacheDuration = 5;
                }

                cachedHttpService({
                    method: 'GET', 
                    url: apiUrl }, 
                    { duration: cacheDuration })
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
                var cacheDuration = 5;
                
                cachedHttpService({ 
                    method: 'GET', 
                    url: '/api/leaderboard/season/' + seasonId }, 
                    { duration: cacheDuration })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data, status) {
                    deferred.reject(status);
                });
                
                return deferred.promise;
            },
            
            updateShowInLeaderboardSetting: function(value) {        
                cachedHttpService({
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
        },
        
        pick : {
            save: function(id, pick) {
                var deferred = $q.defer();
                
                cachedHttpService({
                    method: 'POST',
                    url: '/api/picks',
                    data: { 
                        'id': id,
                        'pick': pick
                    }
                }, {
                    expireEntry: $rootScope.login.currentRound.uri
                })
                .success(function(status) {
                    deferred.resolve(status);
                })
                .error(function(data, status) {
                    deferred.reject(status);
                });
                
                return deferred.promise;
            }
        },
        
        login: function(data) {
            var deferred = $q.defer();
            
            cachedHttpService({
                method: 'POST',
                url: '/api/login',
                data: data
            })
            .success(function(status) {
                deferred.resolve(status);
            })
            .error(function(data, status) {
                deferred.reject(status);
            });
            
            return deferred.promise;
        }
    };
});