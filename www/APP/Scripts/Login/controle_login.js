APACwo.factory('factory_logoff', function ($rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
    return {
        logoff: function () {
            alertify.confirm("Deseja realmente sair?").set('labels', { ok: 'SIM', cancel: 'NÃO' })
                .set('onok', function () {
                    $rootScope.$apply(function () {
                        $rootScope.usuario = {};
                        $localStorage.usuario = {};
                        $cookies.put('cartaoSus', "")
                    })
                })
        }
    }
});

APACwo.controller('controle_login', function ($scope, $rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
    $rootScope.nomeTela = 'Início';

    $scope.init = function () {
        $http({
            method: 'POST',
            url: $rootScope.link_apis + 'consultarCartaoSus',
            params: {
                cartaoSus: $localStorage.usuario.cartaoSus
            }
        }).then(function successCallback(response) {
            console.log(response.data.response[0]);
            $rootScope.listaUsuario = response.data.resultado;

            $scope.guardaLogin = true;

            if ($cookies.get('cartaoSus') === undefined && $localStorage.usuario === undefined) {
                $localStorage.usuario = {};
                $localStorage.usuario.logado = "false";
            }
            else
                $localStorage.usuario.cartaoSus = $cookies.get('cartaoSus')

            if ($localStorage.usuario.logado !== "true") {
                $rootScope.usuario = {};
                $localStorage.usuario = {};

                $localStorage.usuario.cartaoSus = $cookies.get('cartaoSus');

                if ($localStorage.usuario.id_usuario === undefined || $localStorage.usuario.id_usuario === "")
                    $rootScope.usuario = $rootScope.listaUsuario;
                else
                    $rootScope.usuario = $localStorage.usuario;
            }
            else
                $rootScope.usuario = $localStorage.usuario;

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.logar = function () {
        var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString();
        expireDate = expireDate.substring(0, expireDate.lastIndexOf('('))
        console.log($scope.usuario.cartaoSus);
        $http({
            method: 'POST',
            url: $rootScope.link_apis + 'consultarCartaoSus',
            params: {
                cartaoSus: $scope.usuario.cartaoSus
            }
        }).then(function successCallback(response) {
            $scope.usuario = response.data.resultado;
            $cookies.put('cartaoSus', $scope.usuario.cartaoSus)
            $localStorage.usuario = $scope.usuario;

            alertify.success('Seja Bem Vindo!!!');
            $timeout(function () {
                location.reload();
            }, 500)
        }, function errorCallback(response) {
            alertify.error(response.data);
            console.log(response);

            $timeout(function () {
                location.reload();
            }, 500)
        });
    };
});