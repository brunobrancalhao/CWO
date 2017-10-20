APACwo.factory('factory_produto', function () {
    var produto = {};
    return {
        execute: function () {
            adicionar_quant_produto(produto);
        }
    }
});

APACwo.service('service_produto', function () {
    var listOfProduto = {};
});

APACwo.controller('controle_produto', function ($scope, $rootScope, $http, $location, $timeout, aux, service_produto, service_pedido, service_produto_opcao, factory_produto_opcao, factory_personalizar) {
    $rootScope.nomeTela = 'Produto';

    $scope.init = function (x) {

        $scope.chaveTela = aux.gerarRandomKey();
        $scope.listOfProdutos = [];
        $scope.url_modal_opcao = $rootScope.raiz_app + "View/Template/modal_opcao.html";

        try {
            if (x === 1) {//normal

                if (service_pedido.pedido === undefined) {
                    $location.path("/pedido/atendente").replace();
                } else {
                    if ($scope.produtoGrupos === undefined) {
                        var id_grupo_produto = 0;
                        if (factory_personalizar.id_grupo_produto !== undefined && factory_personalizar.id_grupo_produto !== null) {
                            id_grupo_produto = factory_personalizar.id_grupo_produto;
                        };

                        $http({
                            method: 'GET',
                            url: $rootScope.raiz_ws + 'produto/grupo',
                            params: {
                                id_grupo: [id_grupo_produto, 0]
                            }
                        }).then(function successCallback(response) {
                            if (response.data.resultado !== undefined)
                                $scope.produtoGrupos = response.data.resultado;
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                }
            }
            /*else if (x === 2) {//rodizio
                if (service_pedido.pedido !== undefined) {

                    $scope.produtoGrupos = {};
                    $scope.descricao_rodizio = service_pedido.descricao_rodizio;

                    var id_grupo_produto = 0;
                    if (factory_personalizar.id_grupo_produto !== undefined && factory_personalizar.id_grupo_produto !== null) {
                        id_grupo_produto = factory_personalizar.id_grupo_produto;
                    }

                    //grupos:
                    $http.post(raiz_ws + 'produto/buscar_grupo', { id: [0, service_pedido.id_rodizio] }).then(function (resultado) {
                        if (aux.validaRetorno(resultado.data, $scope, $rootScope)) {
                            $scope.produtoGrupos = resultado.data.dados;

                            if (service_pedido.pedido.produtos === undefined) {
                                service_pedido.pedido.produtos = []
                            }
                            if (service_produto_opcao.produtos === undefined) {
                                service_produto_opcao.produtos = {};
                            }
                        }
                    });

                    //iniciais dos produtos.
                    $scope.iniciaisProdutos = []
                    $http.post(raiz_ws + 'produto/buscar_iniciais_rodizio', { id_rodizio: service_pedido.id_rodizio }).then(function (resultado) {
                        if (aux.validaRetorno(resultado.data, $scope, $rootScope)) {
                            for (var i = 0; i < resultado.data.dados.length; i++) {
                                if (resultado.data.dados[i].descricao.charAt(0) !== $scope.iniciaisProdutos[i - 1]) {
                                    var inicial = {}
                                    inicial.toggle = false;
                                    inicial.value = resultado.data.dados[i].descricao.charAt(0)
                                    $scope.iniciaisProdutos.push(inicial)
                                }
                            }
                        }
                    })

                }
                else {
                    $location.path("/pedido/atendente").replace();
                }
            }*/
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.consultaSubGrupo = function (grupo) {
        try {
            if (grupo.subgrupo === undefined) {
                var id_subgrupo_produto = 0;
                if (factory_personalizar.id_sub_grupo_produto !== undefined && factory_personalizar.id_sub_grupo_produto !== null) {
                    id_subgrupo_produto = factory_personalizar.id_sub_grupo_produto;
                };

                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/subgrupo',
                    params: {
                        id_grupo: grupo.id,
                        id_subgrupo: id_subgrupo_produto
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined) {
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

    $scope.consultaProdutoSubGrupo = function (itens, grupo) {
        try {
            //alterado pelo rodizio
            if (itens.produtos === undefined) {

                // $http.post(raiz_ws + 'produto/buscar_produto_by_idgrupo', { id: [itens.id_subgrupo_produto, service_pedido.id_rodizio] }).then(function (resultado) {
                //     if (aux.validaRetorno(resultado.data, $scope, $rootScope)) {
                //         itens.produtos = resultado.data.dados;
                //         itens.show_item = !itens.show_item
                //         if (aux.validaArray(itens)) {
                //             if (service_pedido.id_rodizio === undefined || service_pedido.id_rodizio === 0) {//itens de rodizio nao tem opção por enquanto.
                //                 for (var x = 0 ; x < itens.produtos.length; x++) {
                //                     itens.produtos[x].config_subgrupo = { habilitar_opcao: itens.habilitar_opcao, habilitar_fatias: itens.habilitar_fatias };
                //                 }
                //             }
                //             else {
                //                 for (var x = 0 ; x < itens.produtos.length; x++) {
                //                     itens.produtos[x].config_subgrupo = { habilitar_opcao: false, habilitar_fatias: false };
                //                     itens.produtos[x].subgrupo = "VARIACAO"
                //                     itens.produtos[x].variacao = "ITEM";
                //                     itens.produtos[x].valor_unitario = 0;
                //                     itens.produtos[x].id_pai = service_pedido.id_rodizio_antigo
                //                     itens.produtos[x].show_item = true;
                //                 }
                //             }
                //             aux.updateAll(grupo.subgrupo, 'show_item', false);
                //             itens.show_item = true;
                //         }
                //     }
                // });
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + (itens.habilitar_opcao ? 'produto/produtoopcao' : 'produto'),
                    params: {
                        id_grupo: itens.id_grupo,
                        id_subgrupo: itens.id,
                        id_produto: 0,
                        num_produto: ''
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined) {
                        itens.produtos = response.data.resultado;
                        itens.show_item = !itens.show_item
                        if (aux.validaArray(itens.produtos)) {
                            aux.updateAll(grupo.subgrupo, 'show_item', false);
                            itens.show_item = true;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            } else {
                var status = !itens.show_item;
                aux.updateAll(grupo.subgrupo, 'show_item', false);
                itens.show_item = status;
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

    $scope.item_selecionado = function (produto) {
        try {
            if (produto.selecionado === undefined) {
                produto.selecionado = 'N'
            }

            if (produto.selecionado === 'S') {
                produto.selecionado = 'N'
                for (var i = 0; i < $scope.listOfProdutos.length; i++) {
                    var i_produto = {};
                    i_produto = $scope.listOfProdutos[i];
                    if (i_produto.id_produto === produto.id_produto) {
                        $scope.pedido.produtos.splice(i, 1);
                    }
                }
            }
            else {
                produto.selecionado = 'S'
                $scope.SELECIONADO = produto
                $scope.listOfProdutos.push(produto)
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.alterar_class_selecionado = function (produto) {
        try {
            if (produto.selecionado === 'S') {

                return true;
            }
            else {
                return false;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.remover_produto = function (produto) {
        try {
            for (var i = 0; i < $scope.pedido.produtos.length; i++) {
                var i_produto = $scope.pedido.produtos[i];
                if (i_produto.num_produto === produto.num_produto) {
                    $scope.pedido.produtos.splice(i, 1);
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.adicionar_quant_produto = function (produto) {
        try {
            if (produto.quantidade >= $rootScope.max_quant) {
                alertify.confirm('Deseja realmente adicionar mais produtos?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                    $scope.$apply(function () {
                        $scope.verificar_lista(produto, 0);
                    })
                });
            }
            else {
                $scope.verificar_lista(produto, 0);
            }

        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.adicioar_produto_lista = function (produto) {
        try {
            var encontrado = false;
            for (var i in service_pedido.pedido.produtos) {
                if (service_pedido.pedido.produtos[parseInt(i)].id_temp == produto.id_temp) {
                    encontrado = true;
                }
            }
            produto.quantidade++;
            if (!encontrado) {
                if (!aux.validaArray(service_pedido.pedido.produtos)) {
                    produto.ordem = 0;
                } else {
                    produto.ordem = service_pedido.pedido.produtos.length;
                }
                produto.valor_venda = produto.valor_produto;
                produto.id_temp = aux.gerarRandomKey();
                service_pedido.pedido.produtos.push(produto);
            }
            vinculaProdutosVariacao();
            $("#input_num_produto").focus();
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.verificar_lista = function (produto, op) {
        if (factory_personalizar.consulta_produto_personalizado) {
            factory_personalizar.produto = produto;
            $location.path("/produto/personalizar").replace();
        } else if (produto.subgrupo.descricao === "VARIAÇÃO") {
            //verifica se há produtos para adicionar a variação
            if (service_pedido.pedido.produtos.length !== 0) {
                //atribuir id_pai
                if (produto.variacao === undefined || produto.variacao === "" || produto.variacao === null)
                    produto.variacao = "ADICIONAR";

                $scope.produto = produto;
                $("#modal_variacao").modal("show");
                $(".btn_salvar_produto_variacao").focus();
                alertify.success(produto.descricao + ' inserido com sucesso');
            }
            else {
                alertify.alert("Insira um produto antes de adicionar uma variação!");
            }
        } else {
            if (produto.subgrupo.habilitar_opcao === true) {
                produto.tela = 'PESQUISA';
                factory_produto_opcao.produto = produto
                service_produto_opcao.execute(produto);
            } else {
                if (op === 0) {
                    produto.quantidade++;
                }
                if (!aux.validaArray(service_pedido.pedido.produtos)) {//lista vazia
                    service_pedido.pedido.produtos = [];
                    if (produto.subgrupo === "VARIAÇÃO") { //lista vazia, adicionando variacao
                        alertify.alert("Adicione um produto antes de adicionar uma variação!");
                        produto.quantidade = 0;
                    }
                    else {//lista vazia, adicionando produto normal
                        $scope.adiciona_lista_item(produto, op)
                    }
                }
                else {//lista nao vazia
                    if (produto.subgrupo === "VARIAÇÃO") {//adicionando variacao
                        if (produto.variacao === undefined || produto.variacao === "" || produto.variacao === null)
                            produto.variacao = "ADICIONAR";
                        $scope.adiciona_lista_item(produto, op)
                    }
                    else {//lista nao vazia, adicionando produto normal
                        $scope.adiciona_lista_item(produto, op)
                    }
                }
            }
        }
    };

    $scope.adiciona_lista_item = function (produto, op) {//controles de listagem desagrupada
        try {
            // alterado por rodizio
            var existeProdutoLista = false;
            var prod = aux.clone(produto);

            if (prod.quantAnterior !== undefined) {
                //se opcao for 0, botao "+" pressionado, caso contrário, quantidade inserida diretamente.
                if (op === 0) {
                    produto.quantAnterior = prod.quantidade;
                    prod.quantidade -= prod.quantAnterior;
                }
                else {
                    prod.quantidade -= produto.quantAnterior;
                    produto.quantAnterior = produto.quantidade;
                }
            }
            else {
                produto.quantAnterior = prod.quantidade;
            }
            for (var i = service_pedido.pedido.produtos.length - 1; i >= 0; i--) {

                //verifica se existe o produto na lista.
                if (service_pedido.pedido.produtos[i].id_produto === produto.id_produto &&
                    produto.chaveTela === $scope.chaveTela) {
                    if (aux.validaString(produto.variacao)) {//é variacao
                        //se o proximo item for produto, ela deve ser lançada de forma desagrupada(separando variações por produtos)
                        if (aux.validaArray(service_pedido.pedido.produtos[i + 1]) && !aux.validaString(service_pedido.pedido.produtos[i + 1].variacao)) {
                            if (service_pedido.pedido.produtos.length < $rootScope.maxProdutos) {
                                produto.chaveTela = $scope.chaveTela;
                                prod.id_temp = aux.gerarRandomKey();
                                service_pedido.pedido.produtos.push(prod);
                                existeProdutoLista = true;
                            }
                            else {
                                alertify.alert('Quantidade de produtos excedida, favor enviar o pedido!');
                            }
                            break;
                        }
                        else {
                            service_pedido.pedido.produtos[i].quantidade += prod.quantidade;
                            existeProdutoLista = true;
                            break;
                        }
                    }
                    else {
                        //se o próximo item for uma variação, ele deve ser lançado de forma desagrupada(separando produtos por suas variações)
                        if (aux.validaArray(service_pedido.pedido.produtos[i + 1]) && aux.validaString(service_pedido.pedido.produtos[i + 1].variacao)) {
                            if (service_pedido.pedido.produtos.length < $rootScope.maxProdutos) {
                                produto.chaveTela = $scope.chaveTela;
                                prod.id_temp = aux.gerarRandomKey();
                                service_pedido.pedido.produtos.push(prod);
                                existeProdutoLista = true;

                                /*if (prod.tipo_produto === 'R') {
                                    service_pedido.id_rodizio = prod.id_produto;
                                    service_pedido.descricao_rodizio = prod.descricao;

                                    var idItemRodizioAntigo
                                    var existeRodizio = false
                                    var count = 0;
                                    //regra adicionar produtos ao mesmo rodízio.
                                    for (var h = service_pedido.pedido.produtos.length - 1; h >= 0; h--) {
                                        if (service_pedido.pedido.produtos[h].id_produto === produto.id_produto) {
                                            count++;
                                        }
                                        if (count > 1) {
                                            existeRodizio = true
                                            break;
                                        }
                                    }
                                    $http.post(raiz_ws + 'produto/busca_rodizio', { id: [service_pedido.pedido.id_pedido, produto.id_produto] }).then(function (retorno) {
                                        if (((aux.validaRetorno(retorno.data) && retorno.data.dados.length > 0) || existeRodizio) && prod.quantidade === 1) {
                                            if (retorno.data.dados.length > 0)
                                                idItemRodizioAntigo = retorno.data.dados[retorno.data.dados.length - 1].id_pedido_item
                                            alertify.confirm('Deseja inserir itens no rodizio anterior ou pedir novo rodízio?').set('onok', function () {
                                                $scope.$apply(function () {
                                                    service_pedido.id_rodizio_antigo = idItemRodizioAntigo;
                                                    $timeout(function () {
                                                        produto.quantidade = 1;
                                                        $scope.remover_quant_produto(produto)
                                                    }, 50)
                                                    $location.path("/produto/rodizio").replace();
                                                    return;
                                                })
                                            }).set('oncancel', function () {
                                                $scope.$apply(function () {
                                                    service_pedido.id_rodizio_antigo = produto.id_temp;
                                                    $location.path("/produto/rodizio").replace();
                                                })
                                            }).set('labels', { ok: 'Anterior', cancel: 'Novo Rodízio' })
                                        }
                                        else {
                                            service_pedido.id_rodizio_antigo = produto.id_temp;
                                            $location.path("/produto/rodizio").replace();
                                        }
                                    })
                                }*/
                            }
                            else {
                                alertify.alert('Quantidade de produtos excedida, favor enviar o pedido!');
                            }
                            break;
                        }
                        else {
                            service_pedido.pedido.produtos[i].quantidade += prod.quantidade;
                            existeProdutoLista = true;

                            /*if (prod.tipo_produto === 'R') {
                                service_pedido.id_rodizio = prod.id_produto;
                                service_pedido.descricao_rodizio = prod.descricao;

                                var idItemRodizioAntigo
                                var existeRodizio = false
                                var count = 0;
                                //regra adicionar produtos ao mesmo rodízio.
                                for (var h = service_pedido.pedido.produtos.length - 1; h >= 0; h--) {
                                    if (service_pedido.pedido.produtos[h].id_produto === produto.id_produto) {
                                        count++;
                                    }
                                    if (count > 1) {
                                        existeRodizio = true
                                        break;
                                    }
                                }
                                $http.post(raiz_ws + 'produto/busca_rodizio', { id: [service_pedido.pedido.id_pedido, produto.id_produto] }).then(function (retorno) {
                                    if (((aux.validaRetorno(retorno.data) && retorno.data.dados.length > 0) || existeRodizio) && prod.quantidade === 1) {
                                        if (retorno.data.dados.length > 0)
                                            idItemRodizioAntigo = retorno.data.dados[retorno.data.dados.length - 1].id_pedido_item
                                        alertify.confirm('Deseja inserir itens no rodizio anterior ou pedir novo rodízio?').set('onok', function () {
                                            $scope.$apply(function () {
                                                service_pedido.id_rodizio_antigo = idItemRodizioAntigo;
                                                $timeout(function () {
                                                    produto.quantidade = 1;
                                                    $scope.remover_quant_produto(produto)
                                                }, 50)
                                                $location.path("/produto/rodizio").replace();
                                                return;
                                            })
                                        }).set('oncancel', function () {
                                            $scope.$apply(function () {
                                                service_pedido.id_rodizio_antigo = produto.id_temp;
                                                $location.path("/produto/rodizio").replace();
                                            })
                                        }).set('labels', { ok: 'Anterior', cancel: 'Novo Rodízio' })
                                    }
                                    else {
                                        service_pedido.id_rodizio_antigo = produto.id_temp;
                                        $location.path("/produto/rodizio").replace();
                                    }
                                })
                            }*/
                            break;
                        }
                    }
                }
            }

            if (!existeProdutoLista) {
                produto.chaveTela = $scope.chaveTela;
                prod.id_temp = aux.gerarRandomKey();
                if (service_pedido.pedido.produtos.length < $rootScope.maxProdutos) {
                    service_pedido.pedido.produtos.push(prod);

                    /*if (prod.tipo_produto === 'R') {
                        service_pedido.id_rodizio = prod.id_produto;
                        service_pedido.descricao_rodizio = prod.descricao;

                        var idItemRodizioAntigo
                        var existeRodizio = false
                        var count = 0;
                        //regra adicionar produtos ao mesmo rodízio.
                        for (var h = service_pedido.pedido.produtos.length - 1; h >= 0; h--) {
                            if (service_pedido.pedido.produtos[h].id_produto === produto.id_produto) {
                                count++;
                            }
                            if (count > 1) {
                                existeRodizio = true
                                break;
                            }
                        }
                        $http.post(raiz_ws + 'produto/busca_rodizio', { id: [service_pedido.pedido.id_pedido, produto.id_produto] }).then(function (retorno) {
                            if (((aux.validaRetorno(retorno.data) && retorno.data.dados.length > 0) || existeRodizio) && prod.quantidade === 1) {
                                if (retorno.data.dados.length > 0)
                                    idItemRodizioAntigo = retorno.data.dados[retorno.data.dados.length - 1].id_pedido_item
                                alertify.confirm('Deseja inserir itens no rodizio anterior ou pedir novo rodízio?').set('onok', function () {
                                    $scope.$apply(function () {
                                        service_pedido.id_rodizio_antigo = idItemRodizioAntigo;
                                        $timeout(function () {
                                            produto.quantidade = 1;
                                            $scope.remover_quant_produto(produto)
                                        }, 50)
                                        $location.path("/produto/rodizio").replace();
                                        return;
                                    })
                                }).set('oncancel', function () {
                                    $scope.$apply(function () {
                                        service_pedido.id_rodizio_antigo = produto.id_temp;
                                        $location.path("/produto/rodizio").replace();
                                    })
                                }).set('labels', { ok: 'Anterior', cancel: 'Novo Rodízio' })
                            }
                            else {
                                service_pedido.id_rodizio_antigo = produto.id_temp;
                                $location.path("/produto/rodizio").replace();
                            }
                        })
                    }*/
                }
                else {
                    alertify.alert('Quantidade de produtos excedida, favor enviar o pedido!');
                }
            }
        }
        catch (e) {
            alertify.alert(e.message)
        }
    };

    $scope.remover_quant_produto = function (produto) {
        try {
            if (produto.quantidade > 0) {
                if (produto.tem_opcao === 'NAO') {
                    produto.quantAnterior -= 1;
                    produto.quantidade -= 1;
                    for (var i = service_pedido.pedido.produtos.length - 1; i >= 0; i--) {
                        if (service_pedido.pedido.produtos[i].id_produto === produto.id_produto &&
                            produto.chaveTela === $scope.chaveTela) {// produto já existe na lista.

                            service_pedido.pedido.produtos[i].quantidade -= 1;

                            if (service_pedido.pedido.produtos[i].quantidade === 0) {
                                var count = 1;
                                //remover variacoes
                                for (var j = i + 1; j < service_pedido.pedido.produtos.length; j++) {
                                    if (aux.validaArray(service_pedido.pedido.produtos[j]) &&
                                        aux.validaString(service_pedido.pedido.produtos[j].variacao)) {
                                        count += 1;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                //fim remover variacoes
                                service_pedido.pedido.produtos.splice(i, count);
                            }
                            break;
                        }
                    }
                } else {
                    if (produto.tem_opcao === 'SIM') {
                        factory_produto_opcao.produto = produto
                        service_produto_opcao.execute(produto);
                        $("#modal_opcao").modal("show");
                        return;
                    }
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.verifica_quantidade = function (produto) {
        $scope.clicked = true;
        if (!(produto.subgrupo.habilitar_opcao === true)) {
            if (produto.quantidade >= $rootScope.max_quant) {
                alertify.confirm('Deseja manter ' + produto.quantidade + ' unidades de ' + produto.descricao + ' ?').set('labels', { ok: 'SIM', cancel: 'NÃO' })
                    .set('oncancel', function () {
                        $scope.$apply(function () {
                            if ($scope.clicked) {
                                if (produto.quantAnterior !== undefined) {
                                    produto.quantidade = produto.quantAnterior;
                                    $timeout(function () {
                                        $scope.clicked = false;
                                    }, 100)
                                }
                                else {
                                    produto.quantidade = 0;
                                    $timeout(function () {
                                        $scope.clicked = false;
                                    }, 100)
                                }
                            }
                        });
                    }).set('onok', function () {
                        //o mesmo que ali em baixo
                        if (produto.quantAnterior == undefined)
                            produto.quantAnterior = 0;

                        if (produto.quantAnterior !== produto.quantidade) {
                            if (produto.quantAnterior > produto.quantidade) {
                                var dif = produto.quantAnterior - produto.quantidade;
                                produto.quantidade += dif;
                                for (var i = dif; i > 0; i--)
                                    $scope.remover_quant_produto(produto);
                                $timeout(function () {
                                    $scope.clicked = false;
                                }, 100)
                            }
                            else {
                                $scope.verificar_lista(produto, 1)
                                $timeout(function () {
                                    $scope.clicked = false;
                                }, 100)
                            }
                        }
                        else
                            $timeout(function () {
                                $scope.clicked = false;
                            }, 100)
                    });
            } else if (produto.quantidade <= 0) {
                produto.quantidade = 1;
                $scope.remover_quant_produto(produto)
                $scope.clicked = false;
            } else {
                // aqui
                if (produto.quantAnterior == undefined)
                    produto.quantAnterior = 0;

                if (produto.quantAnterior !== produto.quantidade) {
                    if (produto.quantAnterior > produto.quantidade) {
                        var dif = produto.quantAnterior - produto.quantidade;
                        produto.quantidade += dif;
                        for (var i = dif; i > 0; i--)
                            $scope.remover_quant_produto(produto);
                        $timeout(function () {
                            $scope.clicked = false;
                        }, 100)
                    }
                    else {
                        $scope.verificar_lista(produto, 1)
                        $timeout(function () {
                            $scope.clicked = false;
                        }, 100)
                    }
                }
                else
                    $timeout(function () {
                        $scope.clicked = false;
                    }, 100)
            }
        }
        else {
            produto.quantidade = produto.quantAnterior;
            $scope.verificar_lista(produto, 1)
            $timeout(function () {
                $scope.clicked = false;
            }, 50)

        }
    };

    $scope.guarda_quantidade = function (produto) {
        if (produto.subgrupo.habilitar_opcao === true)
            produto.quantAnterior = produto.quantidade;
    };

    $scope.adicionarProdutoPedido = function () {
        try {
            $timeout(function () {
                if (!$scope.clicked) {
                    if (service_pedido.id_rodizio !== undefined && service_pedido.id_rodizio !== 0) {//rodizio
                        service_pedido.id_rodizio = undefined;
                        service_pedido.descricao_rodizio = undefined;
                        service_pedido.id_rodizio_antigo = undefined;
                    }
                    if (factory_personalizar.consulta_produto_personalizado) {
                        $location.path("/produto/personalizar").replace();
                    } else {
                        $location.path("/pedido/informar_produto").replace();
                    }
                }
            }, 50)
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.voltarPedido = function () {
        $location.path("/pedido/informar_produto").replace();
    }

    $scope.verifica_produtos_pedido = function () {
        try {
            if ($scope.pedido.length > 0) {
                return true;
            }
            else {
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

    $scope.valida_tem_opcao_fatias = function (item) {
        if (aux.validaString(item.habilitar_opcao) && item.habilitar_opcao == true && aux.validaString(item.habilita_fatias) && item.habilita_fatias == true) {
            return true;
        }
        else {
            return false;
        }
    };

    function verifica_produto_adiconado(i_produto) {
        try {
            for (var t = 0; t < service_pedido.pedido.produtos.length; t++) {
                if (service_pedido.pedido.produtos[t].id_produto === i_produto.id_produto) {
                    i_produto.quantidade += service_pedido.pedido.produtos[t].quantidade;
                    service_pedido.pedido.produtos[t].quantidade = i_produto.quantidade;
                    return true;
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.consulta_item_rodizio = function (inicial) {
        try {
            for (var i = 0; i < $scope.produtoGrupos.length; i++) {
                var grupo = $scope.produtoGrupos[i]
                $scope.consultaSubGrupo(grupo)
                if (grupo.subgrupo === undefined) {
                    $timeout(function () {
                        for (var j = 0; j < grupo.subgrupo.length; j++) {
                            var subGrupo = grupo.subgrupo[j];
                            if (subGrupo.produtos === undefined) {
                                $scope.consultaProdutoSubGrupo(subGrupo, grupo)
                                $timeout(function () {
                                    $scope.show_itens_rodizio(grupo, subGrupo, inicial)
                                }, 700)
                            }
                            else {
                                $scope.consultaProdutoSubGrupo(subGrupo, grupo)
                                $scope.show_itens_rodizio(grupo, subGrupo, inicial)
                            }
                        }
                    }, 700)
                }
                else {
                    for (var j = 0; j < grupo.subgrupo.length; j++) {
                        var subGrupo = grupo.subgrupo[j];
                        if (subGrupo.produtos === undefined) {
                            $scope.consultaProdutoSubGrupo(subGrupo, grupo)
                            $timeout(function () {
                                $scope.show_itens_rodizio(grupo, subGrupo, inicial)
                            }, 700)
                        }
                        else {
                            $scope.consultaProdutoSubGrupo(subGrupo, grupo)
                            $scope.show_itens_rodizio(grupo, subGrupo, inicial)
                        }
                    }
                }
            }
        }
        catch (e) {
            alertify.alert(e.message)
        }
    };

    $scope.show_itens_rodizio = function (grupo, subGrupo, inicial) {
        try {
            $scope.toggleInicials(inicial)
            for (var k = 0; k < subGrupo.produtos.length; k++) {
                var prod = subGrupo.produtos[k];

                if (prod.descricao.charAt(0) !== inicial.value) {
                    if (inicial.toggle)
                        prod.show_item = false;
                    else
                        prod.show_item = true;
                }
                else {
                    prod.show_item = true;
                }
            }
            grupo.show_item = true;
            subGrupo.show_item = true;
        }
        catch (e) {
            alertify.alert(e.message)
        }
    };

    $scope.toggleInicials = function (inicial) {
        if (inicial.toggle) {//desligando o filtro de iniciais
            inicial.toggle = false;
        }
        else {//ligando o filtro de iniciais
            for (var i = 0; i < $scope.iniciaisProdutos.length; i++) {
                $scope.iniciaisProdutos[i].toggle = false;
            }
            inicial.toggle = true;
        }
    };
    function vinculaProdutosVariacao() {
        try {
            if (aux.validaArray(service_pedido.pedido.produtos)) {
                console.log(service_pedido.pedido.produtos);
                for (var x = 0; x < service_pedido.pedido.produtos.length; x++) {
                    var produto = service_pedido.pedido.produtos[x];
                    //VARIAÇÃO SEM VINCULO A NENHUM PRODUTO
                    if ((produto.id_pai === 0 || produto.id_pai === undefined || produto.id_pai === null) && produto.variacao === "ADICIONAR" || produto.variacao === "RETIRAR" || produto.variacao === "ITEM") {
                        if (x > 0) {
                            var produto_anterior = service_pedido.pedido.produtos[x - 1];
                            if (produto_anterior.id_pai > 0) {

                                if (produto_anterior.tipo_produto == "R") {
                                    produto.id_pai = 1;
                                }
                                else {
                                    produto.id_pai = produto_anterior.id_pai;
                                }
                            } else {
                                if (produto_anterior.tipo_produto == "R") {
                                    produto.id_pai = 1;
                                }
                                else {
                                    produto.id_pai = produto_anterior.id_temp;
                                }
                            }
                        }
                    }
                    console.log(service_pedido.pedido.produtos[x]);
                }
            }
        }
        catch (e) {
            throw e;
        }
    };

});