(function(angular) {
    'use strict';

    angular.module('mathApp')
        .component('sharedFunction', {
            templateUrl: 'components/sharedFunction/shared-function-template.html',
            controller: SharedFunctionController,
            controllerAs: 'ctrl'
        });

    function SharedFunctionController(sharedFunctionsService, variableService, formulaService, notifyService, $rootRouter) {
        let ctrl = this;

        ctrl.$onInit = function() {
            ctrl.editMode = false;
        };

        ctrl.onSetVariables = function(variablesValues) {
            ctrl.variablesValues = variablesValues;
            console.info('on set variables');
        };

        ctrl.$routerOnActivate = function(next, previous) {
            ctrl.loaded = false;

            let id = next.params.id;
            sharedFunctionsService.getSharedFunction(id)
                .then(data => {
                    ctrl.loaded = true;

                    ctrl.variablesValues = {};
                    Object.assign(ctrl.variablesValues, data.variablesValues);

                    if (data.chartConfig) {
                        ctrl.chartConfig = {};
                        Object.assign(ctrl.chartConfig, data.chartConfig);
                    }

                    ctrl.sharedFormula = data;
                    ctrl.listOfVariables = [];
                    for (let key in ctrl.variablesValues) {
                        let values = ctrl.variablesValues[key];
                        values.sort((a, b) =>  a < b ? -1 : 1);
                        ctrl.listOfVariables.push(key);
                    }
                    ctrl.functionName = ctrl.sharedFormula.functionName || 'f';
                    ctrl.formula = math.parse(ctrl.sharedFormula.rawFormula).compile();
                    ctrl.functionArgs = variableService.getFunctionArgs(ctrl.variablesValues);
                    ctrl.answers = formulaService.executeFormulaForTable(ctrl.formula, ctrl.functionName, ctrl.functionArgs);
                    console.info('debug');
                })
                .catch((error) => {
                    $rootRouter.navigate(['Shared']);
                });
        };

        ctrl.like = function() {
            sharedFunctionsService.likeSharedFunction(ctrl.sharedFormula)
                .then(({sharedFormula, message}) => {
                    ctrl.sharedFormula = sharedFormula;
                    if (message) {
                        notifyService.notify(message);
                    }
                })
                .catch(({message}) => {notifyService.notify(message)});

        };


    }
})(window.angular);