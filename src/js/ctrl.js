var Controllers = angular.module('controllers', []);
Controllers.controller('PhoneListCtrl', ['$scope', function($scope){
  $scope.phones = [
    {name: "Nexus S", snippet: "Fast..."},
    {name: "Motorola XOOM...", snippet: "The Next...."},
    {name: "MOTOROLA XOOM...", snippet: "The Next, Next..."}
  ];
}]);