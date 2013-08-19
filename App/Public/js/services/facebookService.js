'use strict';
pickem.factory('facebook', [function() {
    FB.init({
        appId: '207664432710011', // App ID
        channelUrl: '/channel.html', //Channel file for x-domain communication
		status: true, // check login status
		cookie: true, // enable cookies to allow the server to access the session
		xfbml: true,  // parse XFBML
		frictionlessRequests : true
	});
    
    return FB;
}]);

pickem.factory('facebookService', function(facebook, $q, $rootScope) {
    var resolve = function(err, response, deferred) { 
        $rootScope.$apply(function() {
            if(err) {
                deferred.reject(err);
            } else {
                response.connected = true;
                deferred.resolve(response);
            }
        });
    };
    
    var getUserInfo = function(deferred) {
        facebook.api('/me?fields=id,third_party_id,username,name', function(response) {
            resolve(null, response, deferred);
        });
    };
    
    return {
        login: function() {
            var deferred = $q.defer();
            
            facebook.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    getUserInfo(deferred);
               } else if (response.status == 'not_authorized') {
                   alert('You did not authorize the app');
               } else {
                   facebook.login(function(response) {
                       if (response.authResponse) {
                            getUserInfo(deferred);
                       } else {
                            resolve(response.error, null, deferred);
                       }
                   });
               }
            });
            
            return deferred.promise;
        }
    };
});