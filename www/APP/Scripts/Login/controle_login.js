APACwo.factory('factory_logoff', function ($rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
    return {
        logoff: function () {
            alertify.confirm("Deseja realmente sair?").set('labels', { ok: 'SIM', cancel: 'NÃO' })
                .set('onok', function () {
                    $rootScope.$apply(function () {
                        $rootScope.usuario = { logado: false };
                        $localStorage.usuario = { logado: false };
                        $cookies.put('cartaoSus', "")
                    })
                })
        }
    }
});

APACwo.controller('controle_login', function ($scope, $rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
    $rootScope.nomeTela = 'Início';
    $scope.usuario.cartaoSus = $cookies.get('cartaoSus');
    $scope.init = function () {
        $http({
            method: 'POST',
            url: $rootScope.link_apis + 'consultarCartaoSus',
            params: {
                cartaoSus: $scope.usuario.cartaoSus
            }
        }).then(function successCallback(response) {
            $scope.usuario = response.data.response[0];

            $scope.usuario = $scope.usuario[0];
            $localStorage.usuario = $scope.usuario;
            if ($scope.usuario != undefined) {
                $rootScope.usuario.logado = true;
                $localStorage.usuario = $scope.usuario;
                $cookies.put('cartaoSus', $scope.usuario.cartaoSus);
                alertify.success('Seja Bem Vindo!!!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.logar = function () {
        var expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString();
        expireDate = expireDate.substring(0, expireDate.lastIndexOf('('))
        $http({
            method: 'POST',
            url: $rootScope.link_apis + 'consultarCartaoSus',
            params: {
                cartaoSus: $scope.usuario.cartaoSus
            }
        }).then(function successCallback(response) {
            $scope.usuario = response.data.response[0];

            $scope.usuario = $scope.usuario[0];
            $localStorage.usuario = $scope.usuario;
            if ($scope.usuario != undefined) {
                console.log($scope.usuario);
                alertify.confirm("Seu nome é : " + $scope.usuario.NOME_PACIENTE + " ?").set('labels', { ok: 'Sim', cancel: 'Não' })
                .set('onok', function () {
                    $rootScope.$apply(function () {
                        $rootScope.usuario.logado = true;
                        $localStorage.usuario = $scope.usuario;
                        $cookies.put('cartaoSus', $scope.usuario.cartaoSus);
                        alertify.success('Seja Bem Vindo!!!');
                    })
                })

            }
        }, function errorCallback(response) {
            alertify.error(response.data);

            $timeout(function () {
                location.reload();
            }, 500)
        });
    };
});