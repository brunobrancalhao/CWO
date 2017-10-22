var APACwo = angular.module('APACwo', ['ionic', 'ngRoute', 'ngStorage', 'ui.utils', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies', 'ngMaterial'])//;

    .run(function ($ionicPlatform, $ionicPopup, $rootScope, $http, $localStorage, aux, $cookies) {

        $rootScope.config = {
            servInfo: $cookies.get('cfastServidor')
        };

        $rootScope.nomeTela = 'Início';
        $rootScope.raiz_ws = 'http://' + $rootScope.config.servInfo + '/';
        $rootScope.link_apis = 'http://localhost:5000/'
        $rootScope.sessao_id = 7;
        $rootScope.debug = true;
        $rootScope.appVersion = "1.0.0";
        $rootScope.usuario = {
            logado: false
        };
        $rootScope.listaUsuario = [];

        try {

        }
        catch (e) {
            alertify.alert(e.message);
        }

        $ionicPlatform.ready(function () {

            $ionicPlatform.registerBackButtonAction(function (event) {
                alertify.confirm("Deseja sair da aplicação?").set('labels', { ok: 'SIM', cancel: 'NÃO' })
                    .set('onok', function () {
                        ionic.Platform.exitApp();
                    })
            }, 100);

            //Desabilita o botão de voltar nos navegadores
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

        });
    })

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $rootScope) {
        var raiz_app = $("#raiz_app").val();

        $locationProvider.html5Mode({
            enabled: false
        });

        $routeProvider.when('/', {
            templateUrl: raiz_app + '/View/Template/inicio.html',
        }).when('/pedido/consultar_apac', {
            templateUrl: raiz_app + '/View/Template/consultar_apac.html',
            controller: 'controle_apac'
         }).when('/consultar/apoio', {
            templateUrl: raiz_app + '/View/Template/apoio.html',
            controller: 'controle_apoio'
        }).otherwise({
            redirectTo: '/'
        });

    }]);