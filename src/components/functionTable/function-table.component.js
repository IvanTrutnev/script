(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('functionTable',{
            controller: FunctionTableController,
            controllerAs: 'ctrl',
            templateUrl: 'components/functionTable/function-table-template.html',
            bindings: {
                listOfVariables: '<',
                functionName: '<',
                answers: '<'
            }
        });

    function FunctionTableController(){
        let ctrl = this;

        ctrl.$onInit = onInit;
        ctrl.$onChanges = onChanges;

        function onInit() {
            ctrl.showPanel = false;
            ctrl.pageLimit = 10;
            if (ctrl.pageLimitOption == null) {
                ctrl.pageLimitOption = [];
            }
            ctrl.page = 1;
        }

        function onChanges(changesObj) {
            if (ctrl.answers !== null) {
                ctrl.pageLimitOptions = [5];
                for (let i = 1; i < (ctrl.answers.length/10).toFixed(0); i++) {
                    ctrl.pageLimitOptions.push(i*10);
                }
                ctrl.pageLimitOptions.push(ctrl.answers.length);
            }
            if ('functionName' in changesObj) {
                if (ctrl.functionName === null) {
                    ctrl.functionName = 'f';
                }
            }
        }
    }

})(angular);
