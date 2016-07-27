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

        /*
         * Function that check is raw formula valid
         * If formula is valid its return (in resolved promise):
         *      - TeX representation of formula
         *      - Array of variables
         *      - parsed via Math.js formula
         * If formula in invalid its return (in rejected promise) error with description in error.message.
         * Possible errors:
         *      - Math.js parse error (message = 'Formula is invalid!')
         *      - Function has no variables (message = 'There are no variables!')
         *      - Parsed formula can not be executed with all variables = 1 (message = 'Formula is invalid!')
         *
         * @param {string} rawFormula - string representation of formula (for example 'a+b+c')
         * @return {promise} result
         */
        function parseRawFormula(rawFormula) {
            return new Promise((resolve, reject) => {
                let parsedFormula = null;
                try {
                    parsedFormula = math.parse(rawFormula);
                }
                catch(e) {
                    throw new Error('Formula is invalid!');
                }

                let variables = findVariables(rawFormula);
                let formulaText = parsedFormula.toTex();
                let isFormulaValid = checkFunctionValid(parsedFormula, variables);

                if (isFormulaValid) {
                    resolve({variables, parsedFormula, formulaText});
                }
                else {
                    reject(new Error(isFormulaValid.error));
                }
            });
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

        /**
         * supporting function for service.parseRawFormula
         *
         * @param {object} parsedFormula - parsed via Math.js formula
         * @param {array} variables - array of variables
         * @returns {true|object} - return true if formula valid, {error: 'some error desc'} if invalid
         */
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
            return true;
        }

    }

})(angular);
