(function(angular) {
    'use strict';

    angular.module('mathApp')
        .component('shared', {
            templateUrl: 'components/shared/shared-template.html',
            controller: SharedFunctionController,
            controllerAs: 'ctrl',
            $routeConfig: [
                {path: '/', name: 'SharedFunctions', component: 'sharedFunctions', useAsDefault: true},
                {path: '/:id', name: 'SharedFunction', component: 'sharedFunction'}
            ]
        });

    function SharedFunctionController() {
        let ctrl = this;

    }
})(window.angular);