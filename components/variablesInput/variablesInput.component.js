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

    function variablesInputController($scope, notifyService){
        let ctrl = this;

        $scope.$watch(() => ctrl.listOfVariables, listOfVariablesWatcher);

        ctrl.$onInit = onInit;
        ctrl.setVariables = setVariables;
        ctrl.resetVariables =  resetVariables;

        function setVariables() {
            let isError = false;
            let emptyVariables = [];

            for(let variable in ctrl.variables) {
                let values = ctrl.variables[variable];

                if (values.length === 0) {
                    isError = true;
                    emptyVariables.push(variable);
                    continue;
                }
                else {
                    //parse and replace all values from string to float
                    let parsedValues = [];
                    for (let value of values) {
                        parsedValues.push(parseFloat(value));
                    }
                    ctrl.variables[variable] = parsedValues;
                }

                ctrl.variables[variable].sort((a, b) => {
                    if (a < b) return -1;
                    if (a > b) return 1;
                });
            }

            if (isError) {
                notifyService.variableHasNoValuesNotify(emptyVariables);
            }
            else {
                ctrl.showPanel = false;
                ctrl.onSetVariables({variables: ctrl.variables});
            }
        }

        function resetVariables() {
            for (let variable in ctrl.variables) {
                ctrl.variables[variable] = [];
            }
            ctrl.onSetVariables({variables: null});
        }

        function onInit() {
            ctrl.showPanel = true;
            ctrl.listOfVariables = [];
            ctrl.variables = {};
        }

        function listOfVariablesWatcher(newValue, oldValue) {
            if (newValue !== null) {
                for(let variable of newValue) {
                    if (!(variable in ctrl.variables)) {
                        ctrl.variables[variable] = [];
                    }
                }

                if (oldValue !== null) {

                    let diff = function(firstArray, secondArray) {
                        return firstArray.filter(value => secondArray.indexOf(value) < 0);
                    };

                    let deletedVariables = diff(oldValue, newValue);

                    for (let deletedVariable of deletedVariables) {
                        delete ctrl.variables[deletedVariable];
                    }
                }
            }
        }
    }

})(angular);
