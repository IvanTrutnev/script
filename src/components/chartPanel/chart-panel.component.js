(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('chartPanel',{
            controller: ChartPanelController,
            controllerAs: 'ctrl',
            templateUrl: 'components/chartPanel/chart-panel-template.html',
            bindings: {
                onChartDone: '&',
                listOfVariables: '<',
                variables: '<',
                formula: '<',
                chartConfig: '<',
                isEditMode: '<'
            }
        });

    function ChartPanelController($rootScope, $scope, chartService, notifyService){
        let ctrl = this;

        ctrl.onConfigureChart = onConfigureChart;
        ctrl.onResetChart = onResetChart;
        //ctrl.onChartDone = onChartDone;
        ctrl.$onInit = onInit;
        ctrl.$onChanges = onChanges;

        function onConfigureChart(xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues) {
            if (ctrl.formula !== null) {
                let chartLabels = chartService.getChartLabels(ctrl.variables[xAxisVariable]);
                let {chartData, chartSeries} = calculateChartPoints(ctrl.formula, multiPlotVariableValues, multiPlotVariable, chartLabels, selectedRestVariables, xAxisVariable);

                if ('error' in chartData) {
                    notifyService.notify(chartData.error);
                }
                else {
                    configureChart({chartLabels, chartData, chartSeries});
                    chartDone(xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues);
                }
            }
        }

        function onResetChart() {
            configureChart();
        }

        function chartDone(xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues) {
            let config = {xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues};

            ctrl.onChartDone({config});
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
            ctrl.isEditMode = ctrl.isEditMode ? true : false;
            if (!ctrl.isEditMode && ctrl.chartConfig !== undefined) {
                ctrl.showPanel = true;
                onConfigureChart(ctrl.chartConfig.xAxisVariable, ctrl.chartConfig.multiPlotVariable, ctrl.chartConfig.selectedRestVariables, ctrl.chartConfig.multiPlotVariableValues)
            }
            else {
                configureChart();
                ctrl.showPanel = false;
            }
        }

        function calculateChartPoints(formula, multiPlotVariableValues, multiPlotVariable, chartLabels, selectedRestVariables, xAxisVariable) {
            let chartSeries = chartService.getChartSeries(multiPlotVariable, multiPlotVariableValues);
            let chartData = chartService.setChartData(multiPlotVariableValues, multiPlotVariable, selectedRestVariables, chartLabels, ctrl.variables, xAxisVariable, formula);
            for (let i = 0; i < chartLabels.length; i++ ) {
                chartLabels[i] = parseFloat(chartLabels[i]).toFixed(2);
            }
            return {chartData, chartSeries};
        }

        function onChanges(chengesObj) {
            console.info('debug chart panel');
            if ('formula' in chengesObj) {
                let currentValue = chengesObj.formula.currentValue,
                    previousValue = chengesObj.formula.previousValue;
            }
        }


    }

})(angular);
