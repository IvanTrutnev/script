(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('variablesInput',{
            controller: variablesInputController,
            controllerAs: 'ctrl',
            templateUrl: 'components/variablesInput/variables-input-template.html',
            bindings: {
                listOfVariables: '<',
                onSetVariables: '&'
            }
        });

    function variablesInputController($scope, notifyService, variableService){
        let ctrl = this;

        $scope.$watch(() => ctrl.listOfVariables, listOfVariablesWatcher);

        ctrl.$onInit = onInit;
        ctrl.setVariables = setVariables;
        ctrl.resetVariables =  resetVariables;

        function setVariables() {
            let result = variableService.processVariableValues(ctrl.variables);

            if (result.isError) {
                notifyService.variableHasNoValuesNotify(result.emptyVariables);
            }
            else {
                ctrl.onSetVariables({variables: result.variablesValues});
                ctrl.showPanel = false;
            }
        }

        function resetVariables() {
            variableService.resetVariableValues(ctrl.variables);
            ctrl.onSetVariables({variables: null});
        }

        function onInit() {
            ctrl.showPanel = true;
            ctrl.listOfVariables = [];
            ctrl.variables = {};
        }

        function listOfVariablesWatcher(newValue, oldValue) {
            ctrl.variables = variableService.checkListOfVariablesChanges(newValue, oldValue, ctrl.variables);
        }
    }

})(angular);
