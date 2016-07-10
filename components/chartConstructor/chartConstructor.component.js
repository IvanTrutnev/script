(function(angular) {
    "use strict";
    angular.module('mathApp')
        .component('chartConstructor', {
            controller: ChartConstructorController,
            controllerAs: 'ctrl',
            templateUrl: 'components/chartConstructor/chart-constructor-template.html',
            bindings: {
                listOfVariables: '<',
                variables: '<',
                onConfigureChart: '&'
            }
        });

    function ChartConstructorController($scope, chartService, notifyService) {
        let ctrl = this;

        ctrl.configureChart = configureChart;
        ctrl.$onInit = onInit;

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
            ctrl.nullMultiPlotVariable = null;
            ctrl.xAxisVariable = null;
            ctrl.multiPlotVariable = null;
            ctrl.multiPlotVariableValues = [];
            ctrl.selectedRestVariables = {};
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
