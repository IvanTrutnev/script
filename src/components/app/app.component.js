(function(angular) {
    'use strict';

    angular
        .module('mathApp')
        .component('app', {
            templateUrl: 'components/app/app-template.html',
            $routeConfig: [
                {
                    path: '/', name: 'Main', component: 'mathApp', useAsDefault: true
                },
                {
                    path: '/shared/...', name: 'Shared', component: 'shared'
                }
            ],
            controller: AppController,
            controllerAs: 'ctrl'
        });

    function AppController($firebaseAuth, $rootRouter) {
        let ctrl = this;
        let sidevanLinks = [
            {
                title: 'Math app',
                link: 'Main',
                icon: 'insert_chart',
                isActive: isHrefActive('/')
            },
            {
                title: 'Shared functions',
                link: 'Shared',
                icon: 'share',
                isActive: isHrefActive('/shared')
            }
        ];
        ctrl.user = null;

        ctrl.sidevanLinks = sidevanLinks;
        ctrl.goTo = goTo;

        function goTo(link) {
            ctrl.sidevanLinks.forEach(link => {link.isActive = false});
            link.isActive = true;
            $rootRouter.navigate([link.link]);
        }

        function isHrefActive(route = '/') {
            let currentRout = window.location.href;
            return currentRout.endsWith(route);
        }

        let auth = $firebaseAuth();
        auth.$onAuthStateChanged(user => {ctrl.user = user});

    }
})(window.angular);