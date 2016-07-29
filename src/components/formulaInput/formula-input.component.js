(function (angular) {
    'use strict';

    angular.module('mathApp').component('formulaInput', {
        controller: FormulaInputController,
        controllerAs: 'ctrl',
        templateUrl: 'components/formulaInput/formula-input-template.html',
        bindings: {
            rawFormula: '<',
            onSetFormula: '&'
        }
    });

    function FormulaInputController(formulaService, notifyService, $firebaseAuth) {
        let ctrl = this;

        ctrl.changeMode = handleChangeMode;
        ctrl.resetFormula = resetFormula;
        ctrl.$onChanges = onChanges;
        ctrl.$onInit = onInit;

        function handleChangeMode() {
            if (ctrl.editMode) {
                formulaService.parseRawFormula(ctrl.rawFormula)
                    .then(successParseRawFormulaCb)
                    .catch(errorParseRawFormulaCb);
            }
            else {
                ctrl.editMode = true;
            }
        }

        function resetFormula() {
            ctrl.rawFormula = '';
            ctrl.onSetFormula({formula: null, variables: null, rawFormula: null, formulaTex: null});
            ctrl.editMode = true;
        }

        function onChanges(rawFormulaChanges) {
            let oldValue = rawFormulaChanges.oldValue,
                newValue = rawFormulaChanges.currentValue;
            if (ctrl.rawFormula === null || oldValue === newValue) {
                return;
            }
            ctrl.editMode = true;
            handleChangeMode();
        }

        function onInit() {
            ctrl.rawFormula = '';
            ctrl.editMode = true;
            ctrl.formulaText = ''
        }

        function successParseRawFormulaCb(result) {
            ctrl.formulaText = result.formulaText;
            ctrl.onSetFormula({
                formula: result.parsedFormula,
                functionName: result.functionName,
                variables: result.variables,
                formulaException: result.formulaException,
                rawFormula: ctrl.rawFormula,
                formulaTex: ctrl.formulaText
            });
            ctrl.editMode = false;
        }

        function errorParseRawFormulaCb(error) {
            notifyService.notify(error.message);
        }
    }

})(window.angular);
