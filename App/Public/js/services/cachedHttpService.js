'use strict';

pickem.factory('cachedHttpService', function($cacheFactory, $http, $timeout) {
    var cache = $cacheFactory('pickem_http_cache');
    
    var isCached = function(key) {
        var isCached = (cache.get(key) != null);
        
        if (isCached) {
            isCached = (cache.get(key).expiration > new Date().getTime());
        }
        
        return isCached;
    };
    
    var isCacheable = function(request) {
        return request.method == 'GET';
    };
    
    return function(request, options) {
        options = options || {};
        
        var successCallback,
            errorCallback;
        
        if (isCacheable(request) && isCached(request.url)) {
            $timeout(function() {
                var data = cache.get(request.url).data;
                successCallback(data);
            }, 50);
        } else {
            $http({ 
                method: request.method, 
                url: request.url,
                data: request.data 
            })
            .success(function (data) {
                if (isCacheable(request) && options.duration != null) {
                    var expiration = new Date().getTime() + (options.duration * 60 * 1000);
                    
                    cache.put(request.url, {
                        data: data,
                        expiration: expiration 
                    });
                }
                
                if (options.expireEntry != null) {
                    cache.remove(options.expireEntry);
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