'use strict'

pickem.factory('sharedService', function () {
    return {
        notify: {
            successNotification: function(message, title) {
                toastr.success(message, title);
            }
        }
    };
});