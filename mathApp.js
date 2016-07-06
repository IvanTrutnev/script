(function(angular){
    "use strict";

    angular.module('mathApp', ['ngMaterial', 'md.data.table', 'chart.js']);

    MathJax.Hub.Config({
        skipStartupTypeset: true,
        messageStyle: "none",
        "HTML-CSS": {
            showMathMenu: false
        }
    });
    MathJax.Hub.Configured();

    angular.module('mathApp').directive("mathjaxBind", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function(value) {
                    var $script = angular.element("<script type='math/tex'>")
                        .html(value == undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });
})(angular);