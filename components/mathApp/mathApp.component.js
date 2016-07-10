
(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('mathApp',{
            controller: MathAppController,
            controllerAs: 'ctrl',
            templateUrl: 'components/mathApp/math-app-template.html'
        });

    function MathAppController(variableService, formulaService){
        let ctrl = this;

        ctrl.onSetFormula = onSetFormula;
        ctrl.onSetVariables = onSetVariables;
        ctrl.$onInit = onInit;

        function onSetFormula(formula, listOfVariables) {
            if(formula !== null) {
                ctrl.formula = formula.compile();
            }
            ctrl.listOfVariables = listOfVariables;
            ctrl.answers = null;
        }

        function onSetVariables(variables) {
            ctrl.variables = variables;

            if (variables !== null) {
                ctrl.functionArgs = variableService.getFunctionArgs(ctrl.variables);
                ctrl.answers = formulaService.executeFormula(ctrl.formula, ctrl.functionArgs);
            }
            else {
                ctrl.functionArgs = [];
                ctrl.answers = null;
            }
        }

        function onInit() {
            ctrl.formula = null;
            ctrl.listOfVariables = null;
            ctrl.functionArgs = [];
            ctrl.answers = null;
        }
    }

})(angular);
