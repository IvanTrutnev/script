(function(angular){
    "use strict";
    angular.module('mathApp')
        .component('topToolbar',{
            controller: TopToolbar,
            controllerAs: 'ctrl',
            templateUrl: 'components/topToolbar/top-toolbar-template.html'
        });

    function TopToolbar($firebaseAuth, $mdDialog, $mdSidenav, notifyService){
        let ctrl = this;

        ctrl.$onInit = onInit;
        ctrl.changeAuthState = changeAuthState;
        ctrl.toggleSidenav = toggleSidenav;

        function onInit() {
            ctrl.isUserExist = false;
            ctrl.loginIcon = 'login'
        }

        function changeAuthState(ev) {
            if (!ctrl.isUserExist) {
                $mdDialog.show({
                    controller: LoginDialog,
                    controllerAs: 'ctrl',
                    templateUrl: 'dialogs/loginDialog/login-dialog-template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(() => {notifyService.notify('Success login!')})
            }
            else {
                auth.$signOut();
                notifyService.notify('Success logout!');
            }
        }

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }

        let auth = $firebaseAuth();
        auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser === null) {
                ctrl.isUserExist = false;
            }
            else {
                ctrl.isUserExist = true;
            }
        });


    }

    function LoginDialog($firebaseAuth, $mdDialog, notifyService){
        let ctrl = this;
        let auth = $firebaseAuth();

        ctrl.singIn = singIn;
        ctrl.cancel = cancel;
        ctrl.onSuccessLogin = onSuccessLogin;

        function singIn(provider) {
            auth.$signInWithPopup(provider).then(function(firebaseUser) {
                onSuccessLogin();
            }).catch(function(error) {
                notifyService.notify(error.message);
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function onSuccessLogin() {
            $mdDialog.hide();
        }
    }


})(angular);
