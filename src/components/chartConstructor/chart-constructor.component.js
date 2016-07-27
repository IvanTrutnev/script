(function(angular) {
    "use strict";
    angular.module('mathApp')
        .component('chartConstructor', {
            controller: ChartConstructorController,
            controllerAs: 'ctrl',
            templateUrl: 'components/chartConstructor/chart-constructor-template.html',
            bindings: {
                chartConfig: '<',
                listOfVariables: '<',
                variables: '<',
                onConfigureChart: '&'
            }
        });

    function ChartConstructorController($scope, chartService, notifyService) {
        let ctrl = this;

        ctrl.configureChart = configureChart;
        ctrl.$onInit = onInit;
        ctrl.$onChanges = function(changeObj) {
            console.info('chart congig on charnges');
            console.log(changeObj);
            if ('chartConfig' in changeObj) {
                if (changeObj.chartConfig !== null) {
                    ctrl.xAxisVariable = changeObj.chartConfig.xAxisVariable;
                    ctrl.multiPlotVariable = changeObj.chartConfig.multiPlotVariable;
                    ctrl.multiPlotVariableValues = changeObj.chartConfig.multiPlotVariableValues;
                    ctrl.selectedRestVariables = changeObj.chartConfig.selectedRestVariables;
                }
            }
        };

        $scope.$watch(() => ctrl.xAxisVariable, () =>  {
            if (ctrl.xAxisVariable !== null) {
                if (ctrl.xAxisVariable in ctrl.selectedRestVariables) {
                    delete ctrl.selectedRestVariables[ctrl.xAxisVariable];
                }

                if (ctrl.xAxisVariable === ctrl.multiPlotVariable) {
                    ctrl.multiPlotVariableValues = null;
                    ctrl.multiPlotVariableValues = [];
                }
            }
        });

        $scope.$watch(() => ctrl.multiPlotVariable, (newVal, oldVal) => {
            if (newVal !== oldVal) {
                ctrl.multiPlotVariableValues = [];
            }
        });

        function configureChart() {
            let config = {
                xAxisVariable: ctrl.xAxisVariable,
                multiPlotVariable: ctrl.multiPlotVariable,
                multiPlotVariableValues: ctrl.multiPlotVariableValues,
                selectedRestVariables: ctrl.selectedRestVariables
            };

            config = prepareConfig(config);

            let error = chartService.validateChartConstructorConfig(config, ctrl.listOfVariables);
            if (error !== null) {
                notifyService.notify(error);
            }
            else {
                ctrl.onConfigureChart(config);
            }
        }

        function onInit() {
            console.info('chart config');
            ctrl.nullMultiPlotVariable = null;
            if (ctrl.chartConfig) {
                ctrl.xAxisVariable = ctrl.chartConfig.xAxisVariable;
                ctrl.multiPlotVariable = ctrl.chartConfig.multiPlotVariable;
                ctrl.multiPlotVariableValues = ctrl.chartConfig.multiPlotVariableValues;
                ctrl.selectedRestVariables = ctrl.chartConfig.selectedRestVariables;

            }
            else {
                ctrl.xAxisVariable = null;
                ctrl.multiPlotVariable = null;
                ctrl.multiPlotVariableValues = [];
                ctrl.selectedRestVariables = {};
            }
            ctrl.step = 0;
        }

        function prepareConfig(config) {
            if (Object.keys(config.selectedRestVariables).length === 0) {
                config.selectedRestVariables = null;
            }
            if (config.multiPlotVariable === '') {
                config.multiPlotVariable = null;
            }
            if (config.multiPlotVariable !== null && config.selectedRestVariables !== null) {
                if (config.multiPlotVariable in config.selectedRestVariables) {
                    delete config.selectedRestVariables[config.multiPlotVariable];
                }
            }

            return config;
        }
    }

})(angular);
