'use strict';

pickem.factory('pickemService', function($q, $http) {
    return {
        getCurrentRoundGames: function () {
            var deferred = $q.defer();
            
            $http({method: 'GET', url: '/api/picks/season/1'})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data, status) {
                   deferred.reject(status); 
                });
                
            return deferred.promise;
        }
    };
});