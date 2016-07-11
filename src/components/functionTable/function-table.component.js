(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('functionTable',{
            controller: FunctionTableController,
            controllerAs: 'ctrl',
            templateUrl: 'components/functionTable/function-table-template.html',
            bindings: {
                listOfVariables: '<',
                answers: '<'
            }
        });

    function FunctionTableController($scope){
        let ctrl = this;

        ctrl.$onInit = onInit;

        $scope.$watch(() => ctrl.answers, setPageLimitOptions);

        function onInit() {
            ctrl.showPanel = false;
            ctrl.pageLimit = 10;
            ctrl.pageLimitOption = [];
            ctrl.page = 1;
        }

        function setPageLimitOptions(answers) {
            if (answers !== null) {
                ctrl.pageLimitOption = [5];
                for (let i = 1; i < (answers.length/10).toFixed(0); i++) {
                    ctrl.pageLimitOption.push(i*10);
                }
                ctrl.pageLimitOption.push(answers.length);
            }
        }
    }

})(angular);
