'use strict';
Date.prototype.addMinutes = function(minutes) {
    this.setTime(this.getTime() + (minutes * 60 * 1000));
    return this;
};

pickem.factory('cachedHttpService', function($cacheFactory, $http, $timeout) {
    var cache = $cacheFactory('pickem_http_cache');
    
    var isCached = function(key) {
        var isCached = (cache.get(key) != null);
        
        if (isCached) {
            isCached = (cache.get(key).expiration > new Date());
        }
        
        return isCached;
    };
    
    var isCacheable = function(request) {
        return request.method == 'GET';
    };
    
    return function(request, duration) {
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
                if (isCacheable(request)) {
                    var expiration = new Date().addMinutes(300);
                    if (arguments.length == 2) {
                        expiration = new Date().addMinutes(duration);
                    }
                    
                    cache.put(request.url, {
                        data: data,
                        expiration: expiration 
                    });
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