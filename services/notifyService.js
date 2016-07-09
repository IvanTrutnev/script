(function(angular){
    "use strict";
    angular.module('mathApp')
        .service('notifyService', NotifyService);

    function NotifyService($mdToast){
        let service = this;

        service.notify = notify;
        service.variableHasNoValuesNotify = variableHasNoValuesNotify;

        function notify(message) {
            let toast = $mdToast
                .simple()
                .textContent(message)
                .position('bottom')
                .hideDelay(3000);

            $mdToast.show(toast);
        }

        function variableHasNoValuesNotify(values) {
            let message = `Variables ${values} have no values! Add it!`;
            notify(message);
        }
    }

})(angular);
