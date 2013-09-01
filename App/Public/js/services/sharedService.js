'use strict';
pickem.factory('toast', [function () {
    return toastr;
}]);


pickem.factory('sharedService', function (toast) {
    var notifierErrorCount = 0;
    
    var displayUnsuccessfulNotification = function (message, title, sticky) {
        if (sticky) {
            toast.options.timeOut = 0;
        }
        
        if (notifierErrorCount < 3) {
            toast.warning(message, title);
            notifierErrorCount++;
        } else {
            toast.error('Please try again later', 'Oops! Something is wrong...');
        }
        
        if (sticky) {
            toast.options.timeOut = 5000;
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
            },
        
            clear: function() {
                toast.clear();
            }
        },
        
        errorHandler: {
            handleError: function(errorMessage, title, sticky) {
                if (title == null) {
                    title = 'Oops! Something went wrong...';
                }
                
                if (sticky == null) {
                    sticky = false;
                }
                
                displayUnsuccessfulNotification(errorMessage, title, sticky);    
            }
        }
    };
});