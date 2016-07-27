(function(angular){
    "use strict";
    angular.module('mathApp')
        .service('userService', UserService);

    function UserService($firebaseArray, $firebaseAuth, $firebaseObject) {
        let commonUsersInformationRef = firebase.database().ref('users/commonInfo'),
            commonUsersInformation = $firebaseObject(commonUserInformationRef),
            auth = $firebaseAuth(),
            currentUser = null;

        auth.$onAuthStateChanged((firebaseUser) => {
            currentUser = firebaseUser;
        });

        return {
            currentUser
        }
    }

})(angular);