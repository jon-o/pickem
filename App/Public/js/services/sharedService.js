'use strict'

pickem.factory('sharedService', function () {
    var notifierErrorCount = 0;
    
    var displayUnsuccessfulNotification = function (message, title) {
        if (notifierErrorCount < 3) {
            toastr.warning(message, title);
            notifierErrorCount++;
        } else {
            toastr.error('Please try again later', 'Oops! Something is wrong...');
        }
    };
    
    var displaySuccessfulNotification = function (message, title) {
        toastr.success(message, title);
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