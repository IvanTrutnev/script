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

    function ChartPanelController($rootScope, $scope){
        let ctrl = this;

        ctrl.$onInit = onInit;

        ctrl.onConfigureChart = onConfigureChart;

        function onConfigureChart(xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues) {
            ctrl.xAxisVariable = xAxisVariable;
            ctrl.multiPlotVariable = multiPlotVariable;
            ctrl.selectedRestVariables = selectedRestVariables;
            ctrl.multiPlotVariableValues = multiPlotVariableValues;

            ctrl.showPanel = false;

            console.info('pre draw');
            console.info(ctrl.variables);
            console.info(ctrl.xAxisVariable);
            console.info(ctrl.multiPlotVariable);
            console.info(ctrl.selectedRestVariables);
            console.info(ctrl.multiPlotVariableValues);
            $rootScope.$emit('drawChart', {formula: ctrl.formula, variables: ctrl.variables,xAxisVariable, multiPlotVariable, selectedRestVariables, multiPlotVariableValues});
        }

        function onInit() {
            onConfigureChart(null, null, null);
        }
    }

})(angular);
