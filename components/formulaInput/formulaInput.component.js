(function (angular) {
    'use strict';

    angular.module('mathApp').component('formulaInput', {
        controller: FormulaInputController,
        controllerAs: 'ctrl',
        templateUrl: 'components/formulaInput/formula-input-template.html',
        bindings: {
            onSetFormula: '&'
        }
    });

    function FormulaInputController() {
        let ctrl = this;

        ctrl.setFormula = setFormula;
        ctrl.resetFormula = resetFormula;
        ctrl.changeMode = handleChangeMode;
        ctrl.$onInit = onInit;

        function setFormula() {
            console.log(ctrl.onSetFormula);
        }

        function resetFormula() {
            ctrl.formula = '';
            ctrl.onSetFormula({formula: null, variables: null});
            ctrl.editMode = true;
        }

        function handleChangeMode() {
            if (ctrl.editMode) {
                let formula = math.parse(ctrl.formula);
                let variables = findVariables(ctrl.formula);
                ctrl.formulaText = formula.toTex();
                ctrl.onSetFormula({formula, variables});
                ctrl.editMode = false;
            }
            else {
                ctrl.editMode = true;
            }
        }


        function findVariables(formula) {
            let functions = ['sin', 'cos', 'log', 'e', 'pi', 'tg', 'ctg'];

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            function diffArrays(first, second) {
                let M = first.length;
                let N = second.length;
                let c = 0;
                let result = [];
                for (var i = 0; i < M; i++) {
                    var j = 0, k = 0;
                    while (second[j] !== first[ i ] && j < N) j++;
                    while (result[k] !== first[ i ] && k < c) k++;
                    if (j == N && k == c) result[c++] = first[ i ];
                }
                return result;

            }

            let variables = formula.match(/([a-zA-Z])+/g);
            if(variables !== null) {
                variables = variables.filter(onlyUnique);
                variables = diffArrays(variables, functions);
            }

            return variables;
        }


        function onInit() {
            ctrl.formula = '';
            ctrl.editMode = true;

            ctrl.formulaText = ''

        }
    }

})(window.angular);
