APACwo.factory('factory_produto_opcao', function () {
    var produto = {};
    return {
        execute: function () {
            factory_produto_opcao
        }
    }
});

APACwo.service('service_produto_opcao', function ($rootScope, $http, $location, aux, factory_produto_opcao, service_produto, service_pedido) {
    return {

        execute: function (value) {
            try {
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/opcao',
                    params: {
                        id_produto: factory_produto_opcao.produto.id_produto
                    }
                }).then(function successCallback(response) {
                    $("#modal_opcao").modal("show");
                    factory_produto_opcao.produto.opcoes = response.data.resultado;

                    //PREENCHE DADOS NA TELA SOBRE AS OPÇÕES QUE TEM PREÇO                              
                    factory_produto_opcao.id_parametro = response.data.resultado[0].id_produto_param;
                    factory_produto_opcao.descricao_susbgrupo = factory_produto_opcao.produto.subgrupo.descricao;
                    factory_produto_opcao.habilita_opcao = factory_produto_opcao.produto.subgrupo.habilitar_opcao === true;
                    factory_produto_opcao.habilita_fatias = factory_produto_opcao.produto.subgrupo.habilitar_fatias === true;

                    for (var x = 1; x <= 5; x++) {
                        if (factory_produto_opcao.produto.opcoes[x - 1].op_status === 'SIM' && factory_produto_opcao.produto.opcoes[x - 1].op_valor > 0) {
                            factory_produto_opcao["opt" + x].ativo = true;
                            factory_produto_opcao["op_" + x + "_desc"].descricao = factory_produto_opcao.produto.opcoes[x - 1].op_desc;
                            factory_produto_opcao["valor_" + x].valor = factory_produto_opcao.produto.opcoes[x - 1].op_valor;
                            factory_produto_opcao["op_" + x].descricao = factory_produto_opcao.produto.opcoes[x - 1].op;
                            factory_produto_opcao["op_" + x + "_qtde"].valor = factory_produto_opcao.produto.opcoes[x - 1].op_qtd;
                            factory_produto_opcao["quantidade_" + x].valor = 0;
                        }
                        else {
                            factory_produto_opcao["opt" + x].ativo = false;
                        }
                    }

                    //CARREGA QUANTIDADES JA LANÇADAS
                    if (!aux.validaArray(service_pedido.pedido.produtos)) {
                        service_pedido.pedido.produtos = []
                    }

                    for (var i = 0; i < service_pedido.pedido.produtos.length; i++) {

                        var numero = service_pedido.pedido.produtos[i].opcao;

                        if (factory_produto_opcao.produto.id_produto === service_pedido.pedido.produtos[i].id_produto) {
                            if (service_pedido.pedido.produtos[i].quantidade_opcao !== undefined) {
                                var quantidade_opcao = service_pedido.pedido.produtos[i].quantidade_opcao;
                                factory_produto_opcao["quantidade_" + numero].valor = quantidade_opcao;
                            }
                        }
                        else {
                            if (numero !== undefined && numero !== null) {
                                factory_produto_opcao["quantidade_" + numero].valor = 0;
                            }
                        }
                    }

                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            catch (e) {
                alertify.alert(e.message);
            }
        }
    }
});

APACwo.controller('controle_produto_opcao', function ($scope, $rootScope, $http, $location, $timeout, aux, service_produto_opcao, service_pedido, factory_produto_opcao, factory_produto, factory_personalizar) {
    $scope.init = function () {
        try {

            for (var i = 1; i < 6; i++) {
                factory_produto_opcao["opt" + i] = { ativo: false }
                factory_produto_opcao["op_" + i + "_desc"] = { descricao: "" }
                factory_produto_opcao["op_" + i] = { descricao: "" }
                factory_produto_opcao["valor_" + i] = { valor: 0 }
                factory_produto_opcao["op_" + i + "_qtde"] = { valor: 0 }
                factory_produto_opcao["quantidade_" + i] = { valor: 0 }

                $scope["op" + i] = factory_produto_opcao["opt" + i];
                $scope["descricao_" + i] = factory_produto_opcao["op_" + i + "_desc"];
                $scope["valor_" + i] = factory_produto_opcao["valor_" + i];
                $scope["op_" + i] = factory_produto_opcao["op_" + i];
                $scope["op_" + i + "_qtde"] = factory_produto_opcao["op_" + i + "_qtde"];
                $scope["quantidade_" + i] = factory_produto_opcao["quantidade_" + i];
            }


        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.btn_click_opcao_add = function (valor, optdesc, numero, quantidade) {
        try {
            $scope.pr = factory_produto_opcao.produto;
            var existeregistro = false;
            var produto = factory_produto_opcao.produto;
            produto.opcao_selecionada = numero;
            produto.valor = valor;
            produto.descricao_opcao = optdesc;
            produto.total_particoes = parseInt(quantidade);

            //REDIRECIONA PARA TELA DE PERSONALIZAR
            if (factory_produto_opcao.habilita_fatias) {
                factory_personalizar.produto = produto;
                factory_personalizar.produto.id_opcao = factory_produto_opcao.id_parametro
                $(".modal").modal("hide");
                $location.path("/produto/personalizar").replace();
            } else {
                if (produto.tela === 'PESQUISA') {
                    if (factory_produto_opcao["quantidade_" + numero].valor === undefined) {
                        factory_produto_opcao["quantidade_" + numero].valor = 1;
                    } else {
                        factory_produto_opcao["quantidade_" + numero].valor += 1;
                    }
                    adicionar_produto_opcao(produto, valor, optdesc, numero, quantidade);

                    alertify.success(produto.descricao + ' inserido com sucesso');
                }
                else {
                    if (factory_produto_opcao["quantidade_" + numero].valor === undefined) {
                        factory_produto_opcao["quantidade_" + numero].valor = 1;
                    } else {
                        factory_produto_opcao["quantidade_" + numero].valor += 1;
                    }
                    adicionar_produto_opcao(produto, valor, optdesc, numero, quantidade);

                    alertify.success(produto.descricao + ' inserido com sucesso');
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.btn_click_opcao_remove = function (valor, optdesc, numero) {
        try {
            var produto = {};
            var id_deletado = -1;
            var encontrado = false;
            produto = factory_produto_opcao.produto;

            if (factory_produto_opcao["quantidade_" + numero].valor > 0) {

                factory_produto_opcao["quantidade_" + numero].valor -= 1;
                for (var i = 0; i < service_pedido.pedido.produtos.length; i++) {
                    var produto_i = service_pedido.pedido.produtos[i];
                    if (produto_i.id_temp !== undefined && produto_i.id_produto === factory_produto_opcao.produto.id_produto && !encontrado) {
                        id_deletado = produto_i.id_temp;
                        service_pedido.pedido.produtos.splice(i, 1);
                        encontrado = true;

                        factory_produto_opcao.produto.quantidade--;
                        alertify.error(produto.descricao + ' removido');
                    }
                }
                for (var i = 0; i < service_pedido.pedido.produtos.length; i++) {
                    var produto_i = service_pedido.pedido.produtos[i];
                    if (produto_i.id_pai === id_deletado) {
                        service_pedido.pedido.produtos.splice(i, 1);
                    }
                }
            }

        } catch (e) {
            alertify.alert(e.message);
        }
    }

    function adicionar_produto_opcao(produto, valor, optdesc, numero, quantidade) {
        var prod = aux.clone(produto);
        prod.produtoOpcao = undefined;
        if (prod.quantidade_opcao === undefined) {
            prod.quantidade_opcao = 0;
        }

        var prod_sabor = aux.clone(prod);

        //PRINCIPAL
        prod.descricao = factory_produto_opcao.descricao_susbgrupo + " " + optdesc;
        prod.quantidade_opcao = 1;
        prod.quantidade = 1;
        prod.valor_venda = valor;
        prod.opcao_descricao = optdesc;
        prod.opcao = numero;
        prod.opcoes = undefined;
        prod.id_opcao = factory_produto_opcao.id_parametro
        prod.ordem = service_pedido.pedido.produtos.length + 1;
        prod.id_temp = aux.gerarRandomKey();
        service_pedido.pedido.produtos.push(prod);

        //SABOR
        prod_sabor.particao = quantidade + "/" + quantidade;
        prod_sabor.descricao = prod_sabor.particao + " " + prod_sabor.descricao;
        prod_sabor.variacao = "SABOR";
        prod_sabor.quantidade = 1;
        prod_sabor.opcao = numero;
        prod_sabor.opcoes = undefined;
        prod_sabor.valor_venda = 0;
        prod_sabor.id_opcao = factory_produto_opcao.id_parametro
        prod_sabor.ordem = service_pedido.pedido.produtos.length + 1;
        prod_sabor.id_pai = prod.id_temp;
        service_pedido.pedido.produtos.push(prod_sabor);

        factory_produto_opcao.produto.quantidade += 1;
    }
});