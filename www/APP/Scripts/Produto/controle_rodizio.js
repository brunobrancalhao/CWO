APACwo.factory('factory_rodizio', function () {
    var produto = {};
    return {
        execute: function () {
            factory_rodizio
        }
    }
});

APACwo.controller('controle_rodizio', function ($scope, $rootScope, $http, $location, aux, factory_rodizio, service_produto, service_pedido, aux) {
    $rootScope.nomeTela = 'Rodizio';
    $scope.ProdutosPais = retornoBanco;
    $scope.listaQuantidades = [];
    $scope.produtosPedido = produtosPedido;

    $scope.consultaSubGrupo = function (grupo) {
        try {
            var idProds = "";
            for (var i in $scope.ProdutosPais) {
                for (var j in $scope.ProdutosPais[parseInt(i)].grupos) {
                    if ($scope.ProdutosPais[parseInt(i)].grupos[parseInt(j)].$$hashKey == grupo.$$hashKey) {
                        idProds += $scope.ProdutosPais[parseInt(i)].id_produto + " ,";
                    }
                }
            }
            idProds = idProds.substring(0, (idProds.length - 1));
            if (grupo.subgrupo === undefined || grupo.subgrupo.length <= 0) {
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/subgrupocolecao',
                    params: {
                        id_produto: idProds,
                        id_grupo: grupo.id
                    }
                }).then(function successCallback(response) {
                    grupo.subgrupo = response.data.resultado;
                    $scope.gruposubgrupo = response.data.resultado;
                    for (var i in $scope.gruposubgrupo) {
                        $scope.gruposubgrupo[parseInt(i)].produtos = [];
                        $scope.gruposubgrupo[parseInt(i)].show_item = false;
                    }
                    grupo.show_item = true;
                    grupo.subgrupo = $scope.gruposubgrupo

                    atualizaGrupo(grupo);
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            else {
                var status = !grupo.show_item;
                grupo.show_item = status;
                atualizaGrupo(grupo);
            }
        }
        catch (e) {
            console.log(e);
            alertify.alert(e.message);
        }
    }

    $scope.consultaProdutoSubGrupo = function (subgrupo) {
        try {
            var idProds = "";
            for (var i in $scope.ProdutosPais) {
                for (var j in $scope.ProdutosPais[parseInt(i)].grupos) {
                    for (var k in $scope.ProdutosPais[parseInt(i)].grupos[parseInt(j)].subgrupo) {
                        if ($scope.ProdutosPais[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].$$hashKey == subgrupo.$$hashKey) {
                            idProds += $scope.ProdutosPais[parseInt(i)].id_produto + " ,";
                        }
                    }
                }
            }
            idProds = idProds.substring(0, (idProds.length - 1));
            $http({
                method: 'GET',
                url: $rootScope.raiz_ws + 'produto/colecao',
                params: {
                    id_produto: idProds,
                    id_grupo: subgrupo.id_grupo,
                    id_sub_grupo: subgrupo.id
                }
            }).then(function successCallback(response) {
                subgrupo.show_item = !subgrupo.show_item;
                carregaQtd(response.data.resultado);
                subgrupo.produtos = response.data.resultado;

            }, function errorCallback(response) {
                console.log(response);
            });
        } catch (e) {
            alertify.alert(e.message);
        }
    }

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
    }
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
    }

    $scope.adicionar_quant_produto = function (produto) {
        try {

            if (produto.quantidade >= $rootScope.max_quant) {
                alertify.confirm('Deseja realmente adicionar mais produtos?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                    $scope.$apply(function () {
                        altera_qtd(produto, "+");
                    })
                });
            }
            else {
                altera_qtd(produto, "+");
            }

        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.remover_quant_produto = function (produto) {
        try {
            if (produto.quantidade > 0) {
                altera_qtd(produto, "-");
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    var altera_qtd = function (produto, acao) {
        try {
            var existe = false;
            for (var i in $scope.listaQuantidades) {
                if ($scope.listaQuantidades[parseInt(i)].id_produto == produto.id_produto) {
                    existe = true;
                    if (acao == "+") {
                        $scope.listaQuantidades[parseInt(i)].quantidade++;
                    } else {
                        $scope.listaQuantidades[parseInt(i)].quantidade--;
                    }
                }
            }
            if (existe == false) {
                if (acao == "+") {
                    $scope.listaQuantidades.push({
                        id_produto: produto.id_produto, descricao: produto.descricao, quantidade: 1, adicionado: false
                    });
                }
            }
            for (var i in $scope.listaQuantidades) {
                if ($scope.listaQuantidades[parseInt(i)].id_produto == produto.id_produto) {
                    produto.quantidade = $scope.listaQuantidades[parseInt(i)].quantidade;
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    var carregaQtd = function (produtosList) {
        try {
            for (var i in $scope.listaQuantidades) {
                for (var j in produtosList) {
                    if ($scope.listaQuantidades[parseInt(i)].id_produto == produtosList[parseInt(j)].id_produto) {
                        produtosList[parseInt(j)].quantidade = $scope.listaQuantidades[parseInt(i)].quantidade;
                    }
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.buscaProdutosLista = function () {
        try {
            if ($scope.produtosLista == undefined) {

                if (this.pesquisa.produtodesc != undefined) {

                    var idGrupos = "";
                    for (var i in $scope.ProdutosPais) {
                        idGrupos += $scope.ProdutosPais[parseInt(i)].id_grupo + " ,";
                    }
                    idGrupos = idGrupos.substring(0, (idGrupos.length - 1));

                    var idProds = "";
                    for (var i in $scope.ProdutosPais) {
                        idProds += $scope.ProdutosPais[parseInt(i)].id_produto + " ,";
                    }
                    idProds = idProds.substring(0, (idProds.length - 1));

                    $http({
                        method: 'GET',
                        url: $rootScope.raiz_ws + 'produto/itensfilhoscolecao',
                        params: {
                            id_grupo: idGrupos,
                            id_pedido: id_pedido,
                            id_produto: idProds
                        }
                    }).then(function successCallback(response) {
                        $scope.produtosLista = response.data.resultado;
                        carregaQtd($scope.produtosLista);

                        for (var i in $scope.produtosLista) {
                            $scope.produtosLista[parseInt(i)].id_temp = 1;

                            // for (var j in $scope.produtosPedido) {
                            //     if ($scope.produtosLista[parseInt(i)].id_produto == $scope.produtosPedido[parseInt(j)].id_produto) {
                            //         $scope.produtosLista[parseInt(i)].id_temp = $scope.produtosPedido[parseInt(j)].id_temp;
                            //     }
                            // }
                        }

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            } else {
                carregaQtd($scope.produtosLista);
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.ocultaprincipal = function () {
        try {
            if ($scope.produtosLista == undefined) {
                return false;
            }
            if ($scope.produtosLista.length > 0) {
                if ($scope.pesquisa.produtodesc.length > 0) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            alertify.alert(e.message);
        }
    }
    var atualizaGrupo = function (grupo) {
        try {
            var prodPai = $scope.ProdutosPais;
            for (var i in prodPai) {
                for (var j in prodPai[parseInt(i)].grupos) {
                    if (prodPai[parseInt(i)].grupos[parseInt(j)].$$hashKey == grupo.$$hashKey) {
                        prodPai[parseInt(i)].grupos[parseInt(j)] = grupo;
                    }
                }
            }
            $scope.ProdutosPais = prodPai;
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.adicionarProdutoPedido = function () {
        try {
            if (!$scope.clicked) {
                if (service_pedido.id_rodizio !== undefined && service_pedido.id_rodizio !== 0) {
                    service_pedido.id_rodizio = undefined;
                    service_pedido.descricao_rodizio = undefined;
                    service_pedido.id_rodizio_antigo = undefined;
                }
                if ($scope.ProdutosPais != undefined) {
                    var lista1 = $scope.ProdutosPais;

                    if (lista1.length > 0) {
                        for (var i in lista1) {
                            for (var j in lista1[parseInt(i)].grupos) {
                                for (var k in lista1[parseInt(i)].grupos[parseInt(j)].subgrupo) {
                                    for (var l in lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].produtos) {
                                        var auxProd = lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].produtos[parseInt(l)];
                                        for (var m in $scope.listaQuantidades) {
                                            var listqtd = $scope.listaQuantidades[parseInt(m)];
                                            if (listqtd.id_produto == auxProd.id_produto && listqtd.adicionado == false) {
                                                if (listqtd.quantidade > 0) {
                                                    service_pedido.pedido.produtos.push(
                                                        {
                                                            descricao: auxProd.descricao,
                                                            grupo: {
                                                                descricao: lista1[parseInt(i)].grupos[parseInt(j)].descricao,
                                                                id: lista1[parseInt(i)].grupos[parseInt(j)].id,
                                                                status_linha: ""
                                                            },
                                                            id_produto: auxProd.id_produto,
                                                            incide_taxa_servico: auxProd.incide_taxa_servico,
                                                            num_produto: auxProd.num_produto,
                                                            opcoes: {},
                                                            id_temp: aux.gerarRandomKey(),
                                                            id_pai: 1,
                                                            quantidade: listqtd.quantidade,
                                                            subgrupo: {
                                                                descricao: lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].descricao,
                                                                habilitar_fatias: lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].habilitar_fatias,
                                                                habilitar_opcao: lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].habilitar_opcao,
                                                                id: lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].id,
                                                                id_grupo: lista1[parseInt(i)].grupos[parseInt(j)].subgrupo[parseInt(k)].id_grupo
                                                            },
                                                            tem_opcao: "NÃO",
                                                            tipo: "PRODUTO",
                                                            variacao: "ITEM",
                                                            tipo_produto: "I",
                                                            valor_produto: 0,
                                                            valor_venda: 0
                                                        }
                                                    );
                                                    listqtd.adicionado = true;
                                                    $scope.listaQuantidades[parseInt(m)] = listqtd.adicionado; 
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if ($scope.produtosLista != undefined) {
                    var lista2 = $scope.produtosLista;
                    if (lista2.length > 0) {
                        for (var i in lista2) {
                            for (var m in $scope.listaQuantidades) {
                                var listqtd = $scope.listaQuantidades[parseInt(m)];
                                if (listqtd.id_produto == lista2[parseInt(i)].id_produto && listqtd.adicionado == false) {
                                    if (listqtd.quantidade > 0) {
                                        service_pedido.pedido.produtos.push(
                                            {
                                                descricao: lista2[parseInt(i)].descricao,
                                                grupo: {
                                                    descricao: lista2[parseInt(i)].descricaoGrupo,
                                                    id: lista2[parseInt(i)].id_grupo,
                                                    status_linha: ""
                                                },
                                                id_produto: lista2[parseInt(i)].id_produto,
                                                incide_taxa_servico: lista2[parseInt(i)].incide_taxa_servico,
                                                num_produto: lista2[parseInt(i)].num_produto,
                                                opcoes: {},
                                                id_temp: aux.gerarRandomKey(),
                                                id_pai: 1,
                                                quantidade: lista2[parseInt(i)].quantidade,
                                                subgrupo: {
                                                    descricao: lista2[parseInt(i)].descricaoSubGrupo,
                                                    habilitar_fatias: false,
                                                    habilitar_opcao: false,
                                                    id: 0,
                                                    id_grupo: lista2[parseInt(i)].id_grupo
                                                },
                                                tem_opcao: "NÃO",
                                                tipo: "PRODUTO",
                                                variacao: "ITEM",
                                                tipo_produto: "I",
                                                valor_produto: 0,
                                                valor_venda: 0
                                            }
                                        );
                                        listqtd.adicionado = true;
                                        $scope.listaQuantidades[parseInt(m)] = listqtd.adicionado;
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.listaQuantidades = [];
                $scope.produtosLista = [];
                $scope.ProdutosPais = [];
                $scope.produtosPedido = [];
                produtosPedido = [];

                $location.path("/pedido/informar_produto").replace();
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    }

    $scope.cancelarRodizio = function () {
        alertify.confirm('Deseja realmente cancelar a escolha do rodizio?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
            $scope.$apply(function () {
                $location.path("/pedido/informar_produto").replace();
            })
        });
    }
});

APACwo.service('service_controle_rodizio', function ($rootScope, $http, $location, aux, factory_rodizio, service_produto, service_pedido) {
    return {
        execute: function (produto, pedido) {
            try {
                produtosPedido = pedido.produtos;
                strIdProdutos = "";
                id_pedido = pedido.id_pedido;
                for (var i in pedido.produtos) {
                    strIdProdutos += pedido.produtos[parseInt(i)].id_produto + " ,";
                }
                strIdProdutos = strIdProdutos.substring(0, (strIdProdutos.length - 1));
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/itempaicolecao',
                    params: {
                        id_pedido: pedido.id_pedido,
                        id_produto: strIdProdutos
                    }
                }).then(function successCallback(response) {
                    retornoBanco = response.data.resultado;

                    for (var i in retornoBanco) {
                        retornoBanco[parseInt(i)].grupos = [];
                        retornoBanco[parseInt(i)].id_temp = 1;

                        // for (var j in pedido.produtos) {
                        //     if (retornoBanco[parseInt(i)].id_produto == pedido.produtos[parseInt(j)].id_produto) {
                        //         retornoBanco[parseInt(i)].id_temp = pedido.produtos[parseInt(j)].id_temp;
                        //     }
                        // }
                    }
                    $http({
                        method: 'GET',
                        url: $rootScope.raiz_ws + 'produto/grupocolecao',
                        params: {
                            id_pedido: pedido.id_pedido,
                            id_produto: strIdProdutos
                        }
                    }).then(function successCallback(response) {
                        var grupos = response.data.resultado;
                        for (var i in retornoBanco) {
                            for (var j in grupos) {
                                if (retornoBanco[parseInt(i)].id_grupo == grupos[parseInt(j)].id) {
                                    retornoBanco[parseInt(i)].grupos.push(
                                        {
                                            descricao: grupos[parseInt(j)].descricao, id: grupos[parseInt(j)].id, show_item: false, status_linhas: "", subgrupo: []
                                        }
                                    );
                                }
                            }
                        }
                        $location.path("/produto/rodizio").replace();
                    }, function errorCallback(response) {
                        console.log(response);
                    });

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
