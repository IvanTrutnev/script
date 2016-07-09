(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('myChart',{
            controller: MyChartController,
            controllerAs: 'ctrl',
            templateUrl: 'components/myChart/my-chart-template.html',
            bindings: {
                formula: '<',
                variables: '<',
                xAxisVariable: '<',
                multiPlotVariable: '<',
                selectedRestVariables: '<',
                multiPlotVariableValues: '<'
            }
        });

    function MyChartController($rootScope, notifyService){
        let ctrl = this;

        ctrl.$onInit = onInit;

        $rootScope.$on('drawChart', (event, data) => {
            ctrl.formula = data.formula;
            ctrl.variables = data.variables;
            ctrl.xAxisVariable = data.xAxisVariable;
            ctrl.multiPlotVariable = data.multiPlotVariable;
            ctrl.selectedRestVariables = data.selectedRestVariables;
            ctrl.multiPlotVariableValues = data.multiPlotVariableValues;

            let minValue = parseFloat(ctrl.variables[ctrl.xAxisVariable][0]);
            let maxValue = parseFloat(ctrl.variables[ctrl.xAxisVariable][ctrl.variables[ctrl.xAxisVariable].length - 1]);
            let chartLabels = [minValue];
            for (let i = 1; i < 10; i++) {
                chartLabels.push(minValue + i*(maxValue-minValue)/10);
            }
            chartLabels.push(maxValue);

            let {chartData, chartSeries} = calculateChartPoints(ctrl.formula, ctrl.multiPlotVariableValues, ctrl.multiPlotVariable, chartLabels, ctrl.selectedRestVariables, ctrl.xAxisVariable);

            ctrl.chartLabels = chartLabels;
            ctrl.chartData = chartData;
            ctrl.chartSeries = chartSeries;
            ctrl.showChart = true;

        });

        function onInit() {
            ctrl.showChart = false;
            ctrl.chartOptions = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            };
            ctrl.dataSetOverride =  [{ yAxisID: 'y-axis-1' }];
        }

        function calculateChartPoints(formula, multiPlotVariableValues, multiPlotVariable, chartLabels, selectedRestVariables, xAxisVariable) {
            let chartData = [];
            let chartSeries = [];
            let isError = false;

            for (let i = 0; i < multiPlotVariableValues.length; i++) {
                chartData.push([]);
                let value = multiPlotVariableValues[i];
                chartSeries.push(multiPlotVariable + ' = ' + parseFloat(value).toFixed(2));

                let functionScope = {};
                for (let variable in selectedRestVariables) {
                    functionScope[variable] = selectedRestVariables[variable];
                }
                functionScope[multiPlotVariable] = value;
                for (let xAxisValue of chartLabels) {
                    let formulaValue = null;
                    functionScope[xAxisVariable] = xAxisValue;
                    try {
                        formulaValue = formula.eval(functionScope);
                        chartData[i].push(formulaValue);
                    }
                    catch (e) {
                        console.log(e);
                        isError = true;
                        break;
                    }
                }
                if (isError) {
                    notifyService.notify('Opps, chart have some infinite values');
                    chartData = null;
                    chartSeries = null;
                    break;
                }
            }

            return {chartData, chartSeries};
        }
    }

})(angular);
