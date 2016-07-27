(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('variablesInput',{
            controller: variablesInputController,
            controllerAs: 'ctrl',
            templateUrl: 'components/variablesInput/variables-input-template.html',
            bindings: {
                isEditMode: '<',
                listOfVariables: '<',
                variablesValues: '<',
                onSetVariables: '&'
            }
        });

    function variablesInputController(notifyService, variableService){
        let ctrl = this;

        ctrl.$onInit = onInit;
        ctrl.$onChanges = onChanges;
        ctrl.setVariablesValues = setVariablesValues;
        ctrl.resetVariablesValues =  resetVariablesValues;
        ctrl.onAdd = onAdd;

        function setVariablesValues() {
            variableService.processVariableValues(ctrl.variablesValues)
                .then(() => {
                    ctrl.onSetVariables({variablesValues: ctrl.variablesValues});
                    ctrl.showPanel = false;
                })
                .catch(error => {
                    notifyService.notify(error.message);
                });
        }

        function resetVariablesValues() {
            ctrl.variablesValues = variableService.resetVariableValues(ctrl.variablesValues);
            ctrl.onSetVariables({variablesValues: null});
        }

        function onAdd(value) {
            if (!isFinite(value)) {
                return null;
            }
            return value = Number(value);
        }

        function onInit() {
            ctrl.showPanel = true;
            ctrl.listOfVariables = [];
            ctrl.variablesValues = {};
            if (ctrl.isEditMode === undefined) {
                ctrl.isEditMode = true;
            }
            //ctrl.isEditMode = true;
        }

        function onChanges(changesObject) {
            if ('listOfVariables' in changesObject) {
                onChangesListOfVariables(changesObject.listOfVariables);
            }
        }

        function onChangesListOfVariables({currentValue, previousValue}) {
            ctrl.showPanel = true;

            if (currentValue === null || currentValue === undefined) {
                ctrl.variablesValues = {};
                return;
            }
            ctrl.variablesValues = variableService.checkListOfVariablesChanges(currentValue, previousValue, ctrl.variablesValues);
        }
    }

})(angular);
