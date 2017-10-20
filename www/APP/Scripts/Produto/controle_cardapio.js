APACwo.controller('controle_cardapio', function ($scope, $rootScope, $http, $location, aux) {
    $scope.init = function () {
        try {
            $rootScope.nomeTela = 'Cardápio';
            $scope.produtos = [];
            $http({
                method: 'GET',
                url: $rootScope.raiz_ws + 'produto/grupo'
            }).then(function successCallback(response) {
                if (response.data.resultado !== undefined)
                    $scope.produtoGrupos = response.data.resultado;
            }, function errorCallback(response) {
                console.log(response);
            });
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.consultaSubGrupo = function (grupo) {
        try {
            if (grupo.subgrupo === undefined) {
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/subgrupo',
                    params: {
                        id_grupo: grupo.id,
                        id_subgrupo: 0
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined){
                        grupo.subgrupo = response.data.resultado;
                        aux.updateAll($scope.produtoGrupos, 'show_item', false);
                        grupo.show_item = true;
                    }
                        
                }, function errorCallback(response) {
                    console.log(response);
                });

            } else {
                var status = !grupo.show_item;
                aux.updateAll($scope.produtoGrupos, 'show_item', false);
                grupo.show_item = status;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.consultaProdutoSubGrupo = function (grupo, subgrupo) {
        try {
            if (subgrupo.produtos === undefined) {
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + (subgrupo.habilitar_opcao ? 'produto/produtoopcao' : 'produto'),
                    params: {
                        id_grupo : subgrupo.id_grupo,
                        id_subgrupo: subgrupo.id,
                        id_produto: 0,
                        num_produto: ''
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined){
                        subgrupo.produtos = response.data.resultado;
                        subgrupo.show_item = !subgrupo.show_item
                        if (aux.validaArray(subgrupo.produtos)) {
                            aux.updateAll(grupo.subgrupo, 'show_item', false);
                            subgrupo.show_item = true;
                        }
                    }
                        
                }, function errorCallback(response) {
                    console.log(response);
                });

            } else {
                var status = !subgrupo.show_item;
                aux.updateAll(grupo.subgrupo, 'show_item', false);
                subgrupo.show_item = status;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.exibir_itens_grupo = function (grupo) {
        try {
            if (grupo.show_item && grupo.subgrupo.length > 0) {
                return true;
            } else {
                return false;
            }
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.exibir_itens_subgrupo = function (subgrupo) {
        try {
            if (subgrupo.show_item && subgrupo.produtos.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.valida_tem_opcao = function (item) {
        if (aux.validaString(item.habilitar_opcao) && item.habilitar_opcao == true) {
            return true;
        }
        else {
            return false;
        }
    };
});