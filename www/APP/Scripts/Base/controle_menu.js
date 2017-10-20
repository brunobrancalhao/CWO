APACwo.controller('controle_menu', function ($scope, $rootScope, $mdSidenav, factory_logoff) {

    $scope.toggleLeft = buildToggler('left');
    
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }
    $scope.$watch('isSidenavOpen', function (isSidenavOpen) {
        if (isSidenavOpen == true) {
            document.getElementById('imagemMenu').className = 'fa fa-times';
        } else {

            document.getElementById('imagemMenu').className = 'fa fa-bars';
        }
    });
    $scope.logoff = function () {
        factory_logoff.logoff();
    }

    $scope.full_screen = function () {
        toggleFullScreen($("html"));
    }
    $scope.menu = 'Pedido';
    $scope.setMenu = function (menu) {
        $scope.menu = menu;
    }
    $scope.isMenu = function (menu) {
        if ($scope.menu === menu) {
            return true;
        } else {
            return false;
        }
    }
    function toggleFullScreen() {
        var elem = document.getElementById("html");
        //## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});