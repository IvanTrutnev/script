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

    function FormulaInputController(formulaService, notifyService) {
        let ctrl = this;

        ctrl.changeMode = handleChangeMode;
        ctrl.resetFormula = resetFormula;
        ctrl.$onInit = onInit;

        function handleChangeMode() {
            if (ctrl.editMode) {
                let result = formulaService.parseRawFormula(ctrl.formula);
                if ('error' in result) {
                    notifyService.notify(result.error);
                }
                else {
                    ctrl.formulaText = result.formulaText;
                    ctrl.onSetFormula({formula: result.parsedFormula, variables: result.variables});
                    ctrl.editMode = false;
                }
            }
            else {
                ctrl.editMode = true;
            }
        }

        function resetFormula() {
            ctrl.formula = '';
            ctrl.onSetFormula({formula: null, variables: null});
            ctrl.editMode = true;
        }

        function onInit() {
            ctrl.formula = '';
            ctrl.editMode = true;
            ctrl.formulaText = ''
        }
    }

})(window.angular);
