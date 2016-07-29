
(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('mathApp',{
            controller: MathAppController,
            controllerAs: 'ctrl',
            templateUrl: 'components/mathApp/math-app-template.html'
        });

    function MathAppController(variableService, formulaService, sharedFunctionsService, $firebaseAuth, notifyService){
        let ctrl = this;

        ctrl.onSetFormula = onSetFormula;
        ctrl.onSetVariables = onSetVariables;
        ctrl.onChartDone = onChartDone;
        ctrl.shareFunction = shareFunction;
        ctrl.$onInit = onInit;

        function onSetFormula(formula, functionName, listOfVariables, formulaException, rawFormula, formulaTex) {
            if(formula !== null && ctrl.rawFormula !== rawFormula) {
                ctrl.functionName = functionName;
                ctrl.rawFormula = rawFormula;
                ctrl.formulaException = formulaException;
                ctrl.formulaTex = formulaTex;
                ctrl.formula = formula.compile();
            }
            else {
                ctrl.formula = null;
            }
            ctrl.listOfVariables = listOfVariables;
            ctrl.answers = null;
        }

        function onSetVariables(variablesValues) {
            ctrl.variablesValues = variablesValues;

            if (variablesValues !== null) {
                ctrl.functionArgs = variableService.getFunctionArgs(ctrl.variablesValues);
                ctrl.answers = formulaService.executeFormulaForTable(ctrl.formula, ctrl.functionName, ctrl.functionArgs);
            }
            else {
                ctrl.functionArgs = [];
                ctrl.answers = null;
            }
        }

        function shareFunction() {
            sharedFunctionsService.shareFunction(ctrl.formulaException, ctrl.functionName, ctrl.formulaTex, ctrl.variablesValues, ctrl.user, ctrl.chartConfig)
                .then(({message}) => {notifyService.notify(message)})
                .catch(({message}) => {notifyService.notify(message)});
        }

        function onChartDone(config = null) {
            ctrl.chartConfig = config;
        }

        function onInit() {
            ctrl.editMode = true;
            ctrl.chartData = null;
            ctrl.rawFormula = null;
            ctrl.formula = null;
            ctrl.listOfVariables = null;
            ctrl.functionArgs = [];
            ctrl.answers = null;
            ctrl.chartConfig = null;

            ctrl.user = null;


            ctrl.sharedFormulas = null;
        }


        let auth = $firebaseAuth();
        auth.$onAuthStateChanged((firebaseUser) => {ctrl.user = firebaseUser});

    }

})(angular);
