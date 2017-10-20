APACwo.factory('factory_fechar_mesa', function () {
    var pedido = {};
    return {
        execute: function () {
            return;
        }
    }
});

APACwo.controller('controle_fechar_mesa', function ($scope, $rootScope, $routeParams, $http, $location, $filter, aux, service_pedido, Poller, factory_fechar_mesa) {

    $rootScope.nomeTela = 'Fechamento';
    $scope.mostraDetalhe = false;
    $scope.mesa = [];
    $scope.itens_mesa = [];

    $scope.init = function () {
        try {
            if (factory_fechar_mesa.pedido) {

                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'mesa',
                    params: {
                        id_pedido: factory_fechar_mesa.pedido.id_pedido
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined) {
                        if (response.data.resultado.length > 0) {
                            $scope.mesa = response.data.resultado[0];
                            $scope.mesa.qtd_pessoa = factory_fechar_mesa.pedido.qtd_pessoa;
                            $scope.mesa.vlporpessoa = calculaValorPorPessoa($scope.mesa);
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });

                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'mesa/item',
                    params: {
                        id_pedido: factory_fechar_mesa.pedido.id_pedido
                    }
                }).then(function successCallback(response) {
                    if (response.status !== 204) {
                        if (response.data.resultado !== undefined) {
                            $scope.itens_mesa = response.data.resultado[0].pedidoitem;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            else
                $location.path('/pedido/consultar_mesa').replace();

        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.mostrarDetalhe = function () {
        $scope.mostraDetalhe = !$scope.mostraDetalhe;
    };

    $scope.voltarMesa = function () {
        $location.path('/pedido/consultar_mesa').replace();
    }

    $scope.fecharMesa = function (mesa) {
        try {
            $http({
                method: 'POST',
                url: $rootScope.raiz_ws + 'mesa/fechar_mesa',
                data: mesa
            }).then(function successCallback(response) {
                if (response.data.resultado !== undefined) {
                    alertify.success("Mesa Fechada com Sucesso!");
                    $location.path('/pedido/consultar_mesa').replace();
                }
            }, function errorCallback(response) {
                alertify.error("ERRO - Verifiquei o log para maiores detalhes!");
                console.log(response);
            });
        } catch (error) {
            alertify.error("ERRO - Verifiquei o log para maiores detalhes!");
            console.log(response);
        }
    }

    function calculaValorPorPessoa(mesa) {
        var vltotal = 0;

        vltotal = mesa.vl_total - mesa.vl_credito;

        return vltotal / mesa.qtd_pessoa;
    }
});