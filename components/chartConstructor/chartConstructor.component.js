(function(angular) {
    "use strict";
    angular.module('mathApp')
        .component('chartConstructor', {
            controller: ChartConstructorController,
            controllerAs: 'ctrl',
            templateUrl: 'components/chartConstructor/chart-constructor-template.html',
            bindings: {
                configMode: '<',
                listOfVariables: '<',
                variables: '<',
                onConfigureChart: '&'
            }
        });

    function ChartConstructorController($scope) {
        let ctrl = this;

        ctrl.$onInit = onInit;

        ctrl.configureChart = configureChart;

        $scope.$watch(() => ctrl.configMode, () =>  {
            if(ctrl.configMode === true) {
                onInit();
            }
        });

        function configureChart() {
            let config = {
                xAxisVariable: ctrl.xAxisVariable,
                multiPlotVariable: ctrl.multiPlotVariable,
                multiPlotVariableValues: ctrl.multiPlotVariableValues,
                selectedRestVariables: ctrl.selectedRestVariables
            };

            ctrl.onConfigureChart(config);
        }

        function onInit() {
            ctrl.xAxisVariable = null;
            ctrl.multiPlotVariable = null;
            ctrl.multiPlotVariableValues = [];
            ctrl.selectedRestVariables = {};
            ctrl.step = 0;
        }
    }

})(angular);
