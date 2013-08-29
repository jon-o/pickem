'use strict'

pickem.factory('sharedService', function () {
    var notifierErrorCount = 0;
    
    return {
        notifier: {
            successfulNotification: function(message, title) {
                toastr.success(message, title);
                notifierErrorCount = 0;
            },
            
            unsuccessfulNotification: function(message, title) {
                if (notifierErrorCount < 3)
                {
                    toastr.warning(message, title);
                    notifierErrorCount++;
                } else {
                    toastr.error('Please try again later', 'Oops! Something is wrong...');
                }
            }
        }
    };
});