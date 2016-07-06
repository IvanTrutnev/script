
(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('mathApp',{
            controller: MathAppController,
            controllerAs: 'ctrl',
            templateUrl: 'components/mathApp/math-app-template.html'
        });

    function MathAppController(){
        let ctrl = this;


        ctrl.$onInit = onInit;
        ctrl.onSetFormula = onSetFormula;
        ctrl.onSetVariables = onSetVariables;

        function onSetFormula(formula, listOfVariables) {
            if(formula !== null) {
                ctrl.formula = formula.compile();
            }
            ctrl.listOfVariables = listOfVariables;
            ctrl.answers = null;
        }

        function onSetVariables(variables) {
            ctrl.variables = variables;

            function fillFunctionsArgs(variables) {
                let functionArgs = [];
                let variations = 1;
                angular.forEach(variables, (value, key) => {
                    variations *= value.length;
                });
                for(let i = 0; i < variations; i++) {
                    functionArgs.push({});
                    angular.forEach(variables, (value, key) => {
                        functionArgs[i][key] = 0;
                    });
                }
                let loop = variations;
                angular.forEach(variables, (values, key) => {
                    loop /= values.length;
                    let index = 0;
                    for(let j = 0; j<(variations/values.length)/loop; j++) {
                        for (let value of values) {
                            for (let i = 0; i < loop; i++) {
                                functionArgs[index][key] = value;
                                index++;
                            }
                        }
                    }
                });

                return functionArgs;
            }

            function calculate(formula, functionArgs) {
                for(let args of functionArgs) {
                    args['f'] = formula.eval(args);
                }
                return functionArgs;
            }

            if (variables !== null) {
                ctrl.functionArgs = fillFunctionsArgs(ctrl.variables);
                ctrl.answers = calculate(ctrl.formula, ctrl.functionArgs);
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
