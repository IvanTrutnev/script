(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('chartPanel',{
            controller: ChartPanelController,
            controllerAs: 'ctrl',
            templateUrl: 'components/chartPanel/chart-panel-template.html',
            bindings: {
                listOfVariables: '<',
                variables: '<',
                formula: '<'
            }
        });

    function ChartPanelController($rootScope, $scope, chartService, notifyService){
        let ctrl = this;

        ctrl.onConfigureChart = onConfigureChart;
        ctrl.onResetChart = onResetChart;
        ctrl.$onInit = onInit;

        function onConfigureChart(xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues) {
            if (ctrl.formula !== null) {
                let chartLabels = chartService.getChartLabels(ctrl.variables[xAxisVariable]);
                let {chartData, chartSeries} = calculateChartPoints(ctrl.formula, multiPlotVariableValues, multiPlotVariable, chartLabels, selectedRestVariables, xAxisVariable);

                if ('error' in chartData) {
                    notifyService.notify(chartData.error);
                }
                else {
                    configureChart({chartLabels, chartData, chartSeries});
                }
            }
        }

        function onResetChart() {
            configureChart();
        }

        function configureChart(setting=null) {
            if (setting === null) {
                ctrl.chartLabels = null;
                ctrl.chartData = null;
                ctrl.chartSeries = null;
                ctrl.showChart = false;
            }
            else {
                ctrl.chartLabels = setting.chartLabels;
                ctrl.chartData = setting.chartData;
                ctrl.chartSeries = setting.chartSeries;
                ctrl.showChart = true;
            }
        }

        function onInit() {
            configureChart();
            ctrl.showPanel = false;
        }

        function calculateChartPoints(formula, multiPlotVariableValues, multiPlotVariable, chartLabels, selectedRestVariables, xAxisVariable) {
            let chartSeries = chartService.getChartSeries(multiPlotVariable, multiPlotVariableValues);
            let chartData = chartService.setChartData(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, chartLabels, ctrl.variables, xAxisVariable, formula);
            for (let i = 0; i < chartLabels.length; i++ ) {
                chartLabels[i] = parseFloat(chartLabels[i]).toFixed(2);
            }
            return {chartData, chartSeries};
        }

    }

})(angular);
