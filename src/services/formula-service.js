(function (angular) {
    "use strict";

    angular.module('mathApp')
        .service('formulaService', FormulaService);

    function FormulaService() {
        let service = this;

        service.parseRawFormula = parseRawFormula;
        service.executeFormulaForTable = executeFormulaForTable;
        service.executeFormulaForChart = executeFormulaForChart;

        const ALLOWED_MATH_FUNCTIONS_AND_CONST = ['sin', 'cos', 'log', 'e', 'pi'];

        function parseRawFormula(rawFormula) {
            let variables = findVariables(rawFormula);
            let parsedFormula = math.parse(rawFormula);
            let formulaText = parsedFormula.toTex();
            let isFormulaValid = checkFunctionValid(parsedFormula, variables);

            return (isFormulaValid.error === null) ? {
                variables,
                parsedFormula,
                formulaText
            } : {error: isFormulaValid.error};
        }

        function executeFormulaForTable(compiledFormula, formulaArgs) {
            for (let args of formulaArgs) {
                args['f'] = compiledFormula.eval(args);
            }
            return formulaArgs;
        }

        function executeFormulaForChart(compiledFormula, formulaArgsRows) {
            let chartData = [];

            for (let i = 0; i <  formulaArgsRows.length; i++) {
                let formulaArgsRow = formulaArgsRows[i];
                chartData.push([]);
                for (let formulaArgs of formulaArgsRow) {
                    try {
                        chartData[i].push(compiledFormula.eval(formulaArgs));
                    }
                    catch (e) {
                        return {error: 'Opps, chart have some infinite values'};
                    }
                }
            }

            return chartData;
        }



        function findVariables(rawFormula) {
            let variables = rawFormula.match(/([a-zA-Z])+/g);
            if (variables !== null) {
                variables = variables.filter((value, index, self) => self.indexOf(value) === index);
                variables = arrayDiff(variables, ALLOWED_MATH_FUNCTIONS_AND_CONST);
            }

            return variables;
        }

        function arrayDiff(firstArray, secondArray) {
            return firstArray.filter(value => secondArray.indexOf(value) < 0);
        }

        function checkFunctionValid(parsedFormula, variables) {
            if (variables === null) {
                return {error: 'There are no variables!'};
            }

            let variablesValue = {};
            for (let variable of variables) {
                variablesValue[variable] = 1;
            }

            try {
                parsedFormula.eval(variablesValue);
            }
            catch (e) {
                return {error: 'Formula is invalid!'};
            }
            return {error: null};
        }

    }

})(angular);
