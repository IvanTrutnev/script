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

        $scope.$watch(() => ctrl.listOfVariables, () =>  {
            console.info(ctrl.listOfVariables);
            if (ctrl.listOfVariables !== null) {
                for(let variable of ctrl.listOfVariables) {
                    ctrl.variables[variable] = [];
                }
                console.log(ctrl.variables);
            }
        });

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
            ctrl.listOfVariables = [];
            ctrl.variables = {};
        }
    }

})(angular);
