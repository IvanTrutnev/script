(function(angular) {
    'use strict';

    angular.module('mathApp')
        .component('sharedFunctions', {
            templateUrl: 'components/sharedFunctions/shared-functions-template.html',
            controller: SharedFunctionsController,
            controllerAs: 'ctrl',
            bindings: {
                $router: "<"
            }
        });

    function SharedFunctionsController(sharedFunctionsService, notifyService) {
        let ctrl = this;

        sharedFunctionsService.getSharedFunctions()
            .then(data => ctrl.sharedFormulas = data)
            .catch(() => notifyService.notify('Error during loading shared sharedFormulas. You will redirected in several second'));

    }
})(window.angular);