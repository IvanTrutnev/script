(function (angular) {
    "use strict";
    angular.module('mathApp')
        .service('chartService', ChartService);

    function ChartService(formulaService) {
        let service = this;

        const DOTS_PER_CHART_LINE = 30;

        service.setChartData = setChartData;
        service.getChartSeries = getChartSeries;
        service.getChartLabels = getChartLabels;
        service.validateChartConstructorConfig = validateChartConstructorConfig;

        function setChartData(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, xAxisValues, variables, xAxisVariable, formula) {
            let chartArgs = setChartArgs(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, xAxisValues, variables, xAxisVariable);

            if ('error' in chartArgs) {
                return {error: chartArgs.error};
            }

            let chartData = formulaService.executeFormulaForChart(formula, chartArgs.chartArgs);
            return chartData;
        }

        function getChartSeries(multiPlotVariable, multiPlotVariableValues) {
            if (multiPlotVariable === null) {
                return null;
            }

            let chartSeries = [];
            for (let i = 0; i < multiPlotVariableValues.length; i++) {
                let value = multiPlotVariableValues[i];
                chartSeries.push(multiPlotVariable + ' = ' + parseFloat(value).toFixed(2));
            }
            return chartSeries;
        }

        function getChartLabels(xAxisVariables) {
            let minValue = parseFloat(xAxisVariables);
            let maxValue = parseFloat(xAxisVariables[xAxisVariables.length - 1]);
            let chartLabels = [minValue];
            for (let i = 1; i < DOTS_PER_CHART_LINE; i++) {
                let xAxisValue = minValue + i * (maxValue - minValue) / DOTS_PER_CHART_LINE;
                xAxisValue = xAxisValue;
                chartLabels.push(xAxisValue);
            }
            chartLabels.push(maxValue);

            return chartLabels;
        }

        function validateChartConstructorConfig(config, listOfVariables) {
            if (config.multiPlotVariableValues.length === 0 && config.multiPlotVariable !== null) {
                return `Select one or mor values for ${config.multiPlotVariable} variable`;
            }

            if (config.xAxisVariable === null) {
                return 'Select variable for x axis';
            }

            let variablesWithoutValues = [];
            for (let variable of listOfVariables) {
                let isUsed = variable === config.xAxisVariable || config.multiPlotVariable;
                if (config.selectedRestVariables !== null) {
                    if (variable in config.selectedRestVariables) {
                        isUsed = true;
                    }
                }

                if (!isUsed) {
                    variablesWithoutValues.push(variable);
                }
            }
            for (let variable in config.selectedRestVariables) {
                if (config.selectedRestVariables[variable] === 0) {
                    variablesWithoutValues.push(variable);
                }
            }

            variablesWithoutValues = variablesWithoutValues.filter((value, index, self) => self.indexOf(value) === index);

            if (variablesWithoutValues.length !== 0) {
                return `Select values for ${variablesWithoutValues} variables`;
            }

            return null;
        }


        function setChartArgs(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, xAxisValues, variables, xAxisVariable) {
            let chartArgs = null;

            if (multiPlotVariable !== null) {
                chartArgs = setChartArgsWithMultiPlotVariable(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, xAxisValues, xAxisVariable);
            }

            if (selectedRestVariables !== null && chartArgs === null) {
                chartArgs = setChartArgsWithoutMultiPlotVariable(selectedRestVariables, xAxisValues, xAxisVariable);
            }

            if (xAxisValues !== null && chartArgs === null) {
                chartArgs = setSimpleChartArgs(xAxisValues, xAxisVariable);
            }

            let error = validateChartArgs(chartArgs, variables);

            return (error === null) ? {chartArgs} : {error};
        }

        function setChartArgsWithMultiPlotVariable(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, xAxisValues, xAxisVariable) {
            let chartArgs = [];
            for (let i = 0; i < multiPlotVariableValues.length; i++) {
                chartArgs.push([]);
                let value = multiPlotVariableValues[i];
                let functionScope = {};
                functionScope[multiPlotVariable] = value;

                for (let variable in selectedRestVariables) {
                    functionScope[variable] = selectedRestVariables[variable];
                }
                for (let xAxisValue of xAxisValues) {
                    let currentFunctionScope = functionScope;
                    currentFunctionScope[xAxisVariable] = xAxisValue;
                    chartArgs[i].push(Object.assign({}, currentFunctionScope));
                }
            }

            return chartArgs;
        }

        function setChartArgsWithoutMultiPlotVariable(selectedRestVariables, xAxisValues, xAxisVariable) {
            let chartArgs = [[]];
            let functionScope = {};
            for (let variable in selectedRestVariables) {
                functionScope[variable] = selectedRestVariables[variable];
            }
            for (let xAxisValue of xAxisValues) {
                let currentFunctionScope = functionScope;
                currentFunctionScope[xAxisVariable] = xAxisValue;
                chartArgs[0].push(Object.assign({}, currentFunctionScope));
            }

            return chartArgs;
        }

        function setSimpleChartArgs(xAxisValues, xAxisVariable) {
            let chartArgs = [[]];
            let functionScope = {};
            for (let xAxisValue of xAxisValues) {
                let currentFunctionScope = functionScope;
                currentFunctionScope[xAxisVariable] = xAxisValue;
                chartArgs[0].push(Object.assign({}, currentFunctionScope));
            }

            return chartArgs;
        }

        function validateChartArgs(chartArgs, variables) {
            if (chartArgs.length === null || chartArgs[0].length === 0) {
                return 'There are no chart lines!';
            }

            return null;
        }
    }

})(angular);