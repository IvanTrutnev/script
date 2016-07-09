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

    function variablesInputController($scope){
        let ctrl = this;

        $scope.$watch(() => ctrl.listOfVariables, listOfVariablesWatcher);

        ctrl.$onInit = onInit;
        ctrl.setVariables = setVariables;
        ctrl.resetVariables =  resetVariables;

        function setVariables() {
            for(let variable in ctrl.variables) {
                ctrl.variables[variable].sort((a, b) => {
                    a = Number(a);
                    b = Number(b);
                    if (a < b) return -1;
                    if (a > b) return 1;
                    if (a === b) return 0;
                });
            }

            ctrl.onSetVariables({variables: ctrl.variables});
        }

        function resetVariables() {
            ctrl.variables = {};
            ctrl.onSetVariables({variables: null});
        }

        function onInit() {
            ctrl.showTable = false;
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
