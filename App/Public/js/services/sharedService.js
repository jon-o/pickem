'use strict';
pickem.factory('toast', [function () {
    return toastr;
}]);


pickem.factory('sharedService', function (toast) {
    var notifierErrorCount = 0;
    
    var displayUnsuccessfulNotification = function (message, title) {
        if (notifierErrorCount < 3) {
            toast.warning(message, title);
            notifierErrorCount++;
        } else {
            toast.error('Please try again later', 'Oops! Something is wrong...');
        }
    };
    
    var displaySuccessfulNotification = function (message, title) {
        toast.success(message, title);
        notifierErrorCount = 0;
    };
    
    return {
        notifier: {
            successfulNotification: function(message, title) {
                displaySuccessfulNotification(message, title);
            },
            
            unsuccessfulNotification: function(message, title) {
                displayUnsuccessfulNotification(message, title);
            }
        },
        
        errorHandler: {
            handleError: function(errorMessage) {
                displayUnsuccessfulNotification(errorMessage, 'Oops! Something went wrong...');    
            }
        }
    };
});