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

    function MyChartController($rootScope){
        let ctrl = this;

        ctrl.$onInit = onInit;

        $rootScope.$on('drawChart', (event, data) => {
            console.info('draw');
            console.log(data);
            ctrl.formula = data.formula;
            ctrl.variables = data.variables;
            ctrl.xAxisVariable = data.xAxisVariable;
            ctrl.multiPlotVariable = data.multiPlotVariable;
            ctrl.selectedRestVariables = data.selectedRestVariables;
            ctrl.multiPlotVariableValues = data.multiPlotVariableValues;
            console.info(ctrl.variables);
            console.info(ctrl.xAxisVariable);
            console.info(ctrl.multiPlotVariable);
            console.info(ctrl.selectedRestVariables);
            console.info(ctrl.multiPlotVariableValues);

            let minValue = parseFloat(ctrl.variables[ctrl.xAxisVariable][0]);
            let maxValue = parseFloat(ctrl.variables[ctrl.xAxisVariable][ctrl.variables[ctrl.xAxisVariable].length - 1]);
            let chartLabels = [minValue];
            for (let i = 1; i < 10; i++) {
                chartLabels.push(minValue + i*(maxValue-minValue)/10);
            }
            chartLabels.push(maxValue);

            let chartData = [];
            let chartSeries = [];
            for (let i = 0; i < ctrl.multiPlotVariableValues.length; i++) {
                chartData.push([]);
                let value = ctrl.multiPlotVariableValues[i];
                chartSeries.push(ctrl.multiPlotVariable + ' = ' + parseFloat(value).toFixed(2));

                console.error('!!!!!');
                let functionScope = {};
                for (let variable in ctrl.selectedRestVariables) {
                    functionScope[variable] = ctrl.selectedRestVariables[variable];
                    console.info(functionScope);
                }
                functionScope[ctrl.multiPlotVariable] = value;
                for (let xAxisValue in chartLabels) {
                    functionScope[ctrl.xAxisVariable] = xAxisValue;
                    console.info(functionScope);
                    chartData[i].push(ctrl.formula.eval(functionScope));
                }
            }

            ctrl.chartLabels = chartLabels;
            ctrl.chartData = chartData;
            ctrl.chartSeries = chartSeries;
            ctrl.showChart = true;
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

            console.error('!!!!!!');
            console.info(ctrl.chartLabels);
            console.info(ctrl.chartData);
            console.info(ctrl.chartSeries);
            console.error('!!!!!!');
        });

        function onInit() {
            ctrl.showChart = false;
        }
    }

})(angular);
