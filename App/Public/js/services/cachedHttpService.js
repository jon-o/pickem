'use strict';

pickem.factory('cachedHttpService', function($cacheFactory, $http, $timeout) {
    var cache = $cacheFactory('pickem_http_cache');
    
    var isCached = function(key) {
        return (cache.get(key) != null);
    };
    
    var isCacheable = function(request) {
        return request.method == 'GET';
    };
    
    return function(request) {
        var successCallback,
            errorCallback;
        
        if (isCacheable(request) && isCached(request.url)) {
            $timeout(function() {
                var data = cache.get(request.url);
                successCallback(data);
            }, 50);
        } else {
            $http({ method: request.method, url: request.url })
            .success(function (data) {
                if (isCacheable(request)) {
                    cache.put(request.url, data);
                }
                successCallback(data);
            })
            .error(function (data, status) {
               errorCallback(data, status); 
            });
        }
        
        var callbackConfig = {
            success: function(callback) {
                successCallback = callback;
                
                return callbackConfig;
            },
            
            error: function(callback) {
                errorCallback = callback;
                
                return callbackConfig;
            }
        };
        
        return callbackConfig;
    };
});