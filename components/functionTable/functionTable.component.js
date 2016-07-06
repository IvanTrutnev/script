(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('functionTable',{
            controller: FunctionTableController,
            controllerAs: 'ctrl',
            templateUrl: 'components/functionTable/function-table-template.html',
            bindings: {
                listOfVariables: '<',
                answers: '<'
            }
        });

    function FunctionTableController(){
        let ctrl = this;

        ctrl.$onInit = onInit;

        function onInit() {
            ctrl.showPanel = false;
        }
    }

})(angular);
