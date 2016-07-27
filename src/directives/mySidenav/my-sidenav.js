/**
 * Created by nixol on 7/12/2016.
 */
(function(angular){
    "use strict";
    angular.module('mathApp')
        .directive('mySidenav', function() {
            return {
                replace: true,
                controller: MySidenavController,
                controllerAs: 'ctrl',
                templateUrl: 'directives/mySidenav/my-sidenav-template.html'
            };
        });

    function MySidenavController($firebaseAuth){
        let ctrl = this;
        ctrl.user = null;

        let auth = $firebaseAuth();
        auth.$onAuthStateChanged(user => {ctrl.user = user});
    }

})(angular);
