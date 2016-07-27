(function(angular){
    "use strict";
    angular.module('mathApp')
        .directive('userAvatar', function() {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    avatar: '=avatar',
                    avatarClass: '@avatarClass'
                },
                templateUrl: '/directives/userAvatar/user-avatar-template.html'
            };
        });

})(angular);