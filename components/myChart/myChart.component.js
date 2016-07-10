(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('myChart',{
            controller: MyChartController,
            controllerAs: 'ctrl',
            templateUrl: 'components/myChart/my-chart-template.html',
            bindings: {
                chartLabels: '<',
                chartData: '<',
                chartSeries: '<'
            }
        });

    function MyChartController($rootScope, notifyService){
        let ctrl = this;

        ctrl.$onInit = onInit;

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

    }

})(angular);
