(function(angular){
    "use strict";

    angular.module('mathApp', ['ngMaterial', 'md.data.table', 'chart.js', 'ngMdIcons']);

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

    let a = '';

    let config = {
        apiKey: "AIzaSyBgfV7YJ8EbMnIQtD4vYDPYsOUZHPZhD9k",
        authDomain: "kurulev-script.firebaseapp.com",
        databaseURL: "https://kurulev-script.firebaseio.com",
        storageBucket: "kurulev-script.appspot.com"
    };
    firebase.initializeApp(config);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then((reg) => {console.info(reg)})
            .catch((e) => {console.error('Error during service worker registration', e)});
    }
})(angular);