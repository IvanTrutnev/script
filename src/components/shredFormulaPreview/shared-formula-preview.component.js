(function(angular) {
    'use strict';

    angular.module('mathApp')
        .component('sharedFormulaPreview', {
            templateUrl: 'components/shredFormulaPreview/shared-formula-preview-template.html',
            controller: SharedFormulaPreviewController,
            controllerAs: 'ctrl',
            bindings: {
                sharedFormula: '<',
                $router: '<'
            }
        });

    function SharedFormulaPreviewController(sharedFunctionsService, notifyService, $rootRouter) {
        let ctrl = this;

        ctrl.user = {avatar: null};

        ctrl.currentUser = null;

        ctrl.like = function() {
            sharedFunctionsService.likeSharedFunction(ctrl.sharedFormula)
                .then(({sharedFormula, message}) => {
                    ctrl.sharedFormula = sharedFormula;
                    if (message) {
                        notifyService.notify(message);
                    }
                })
                .catch(({message}) => {notifyService.notify(message)});

        };

        ctrl.viewIt = function() {
            $router.navigate(['SharedFunction', {id: ctrl.sharedFormula.$id}]);
        };
    }
})(window.angular);