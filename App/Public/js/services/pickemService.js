'use strict';

pickem.factory('pickemService', function($q, cachedHttpService) {
    return {
        round: {
            /*getCurrentRoundGames: function (seasonId) {
                var deferred = $q.defer();

                cachedHttpService({method: 'GET', url: '/api/picks/season/' + seasonId})
                     .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                       deferred.reject(status); 
                    });    
                
                return deferred.promise;
            },*/
            
            getRoundGames: function (apiUrl) {
                var deferred = $q.defer();

                cachedHttpService({method: 'GET', url: apiUrl})
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
                
                cachedHttpService({ 
                    method: 'GET', 
                    url: '/api/leaderboard/season/' + seasonId }, 5)
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
            savePick: function(id, pick) {
                var deferred = $q.defer();
                
                cachedHttpService({
                    method: 'POST',
                    url: '/api/picks',
                    data: { 
                        'id': id,
                        'pick': pick
                    }
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