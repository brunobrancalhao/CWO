APACwo.controller('controle_receita', function ($scope, $rootScope, $http, $location, $timeout, aux, service_produto, service_pedido, service_produto_opcao, factory_produto_opcao, factory_personalizar) {

    $scope.init = function () {
        try {
            $rootScope.nomeTela = 'Receita';
            $scope.produtos = [];
            $scope.iniciaisProdutos = [];
            $scope.relatorioReceita = false;
            $http({
                method: 'GET',
                url: $rootScope.raiz_ws + 'produto/opcaoreceita'
            }).then(function successCallback(response) {
                if (response.data.resultado !== undefined) {
                    $scope.iniciaisProdutos = response.data.resultado;
                    iniciaParticao();

                    for (var i in $scope.iniciaisProdutos) {
                        for (var j in $scope.particoes) {
                            if ($scope.iniciaisProdutos[parseInt(i)].op_qtd == $scope.particoes[parseInt(j)].particao) {
                                $scope.particoes[parseInt(j)].habilitada = true;
                            }
                        }
                        $scope.iniciaisProdutos[parseInt(i)].selecionada = false;
                        $scope.iniciaisProdutos[parseInt(i)].produtosPai = [];
                    }

                }
            }, function errorCallback(response) {
                console.log(response);
            });
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    var iniciaParticao = function () {
        try {
            $scope.particoes = [{ particao: 1, habilitada: true, selecionada: false },
            { particao: 2, habilitada: true, selecionada: false },
            { particao: 3, habilitada: true, selecionada: false },
            { particao: 4, habilitada: true, selecionada: false },
            { particao: 8, habilitada: false, selecionada: false }];
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    var limpaSaborEscolhido = function () {
        try {
            for (var j in $scope.iniciaisProdutos) {
                if ($scope.iniciaisProdutos[parseInt(j)].produtosPai != undefined) {
                    if ($scope.iniciaisProdutos[parseInt(j)].produtosPai.length > 0) {
                        for (var i in $scope.iniciaisProdutos[parseInt(j)].produtosPai) {
                            $scope.iniciaisProdutos[parseInt(j)].produtosPai[parseInt(i)].selecionada = false;
                        }
                    }
                }
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.validaEscolhaParticao = function (item) {
        try {
            if (!item.selecionada) {
                for (var i in $scope.iniciaisProdutos) {
                    $scope.iniciaisProdutos[parseInt(i)].selecionada = false;
                }
                $scope.produtosTela = item.produtosPai;
                if (item.produtosPai.length == 0) {
                    $http({
                        method: 'GET',
                        url: $rootScope.raiz_ws + 'produto/itenspaireceita',
                        params: {
                            id_produto_opcao: item.id_produto_opcao
                        }
                    }).then(function successCallback(response) {
                        if (response.data.resultado !== undefined) {
                            item.produtosPai = response.data.resultado;
                            $scope.produtosTela = item.produtosPai;
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
                marcaSelecionado(item);
            } else {
                item.selecionada = !item.selecionada;
                $scope.produtosTela = [];
            }
            iniciaParticao();
            limpaSaborEscolhido();
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.validaPedacos = function (item) {
        try {
            if (!item.selecionada) {
                for (var i in $scope.particoes) {
                    $scope.particoes[parseInt(i)].selecionada = false;
                }
                limpaSaborEscolhido();
                marcaSelecionado(item);
            } else {
                item.selecionada = !item.selecionada;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    var marcaSelecionado = function (item) {
        try {
            item.selecionada = !item.selecionada;
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.escolheSabor = function (item) {
        try {
            var qtdSelecionado = 0;
            var qtdParticao = 0;
            if (!item.selecionada) {
                for (var j in $scope.particoes) {
                    if ($scope.particoes[parseInt(j)].selecionada == true) {
                        qtdParticao = $scope.particoes[parseInt(j)].particao;
                        break;
                    }
                }
                for (var i in $scope.produtosTela) {
                    if ($scope.produtosTela[parseInt(i)].selecionada == true) {
                        qtdSelecionado++;
                    }
                }
                if (qtdSelecionado < qtdParticao) {
                    marcaSelecionado(item);
                }
                if (qtdParticao == 0) {
                    alertify.alert('Selecione uma partição para poder selecionar um sabor!');
                }
            } else {
                item.selecionada = !item.selecionada;
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.mostrarReceita = function () {
        try {
            var idProdsPai = "";
            $scope.listaProdutosReceita = [];

            var qtdSelecionado = 0;
            var qtdParticao = 0;

            for (var j in $scope.particoes) {
                if ($scope.particoes[parseInt(j)].selecionada == true) {
                    qtdParticao = $scope.particoes[parseInt(j)].particao;
                    break;
                }
            }
            for (var i in $scope.produtosTela) {
                if ($scope.produtosTela[parseInt(i)].selecionada == true) {
                    qtdSelecionado++;
                }
            }
            if (qtdSelecionado == qtdParticao && qtdParticao > 0) {
                $scope.relatorioReceita = true;
                for (var j in $scope.iniciaisProdutos) {
                    if ($scope.iniciaisProdutos[parseInt(j)].produtosPai != undefined) {
                        if ($scope.iniciaisProdutos[parseInt(j)].produtosPai.length > 0) {
                            for (var i in $scope.iniciaisProdutos[parseInt(j)].produtosPai) {
                                if ($scope.iniciaisProdutos[parseInt(j)].produtosPai[parseInt(i)].selecionada) {
                                    var auxP = $scope.iniciaisProdutos[parseInt(j)].produtosPai[parseInt(i)];
                                    idProdsPai += auxP.id_produto + " ,";
                                    $scope.listaProdutosReceita.push({
                                        id_produto: auxP.id_produto, descricao: auxP.descricao, prodFilhos: []
                                    });
                                }
                            }

                        }
                    }
                }
                idProdsPai = idProdsPai.substring(0, (idProdsPai.length - 1));
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/itensfilhosreceita',
                    params: {
                        id_produto: idProdsPai
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined) {
                        for (var i in $scope.listaProdutosReceita) {
                            for (var j in response.data.resultado) {
                                if ($scope.listaProdutosReceita[parseInt(i)].id_produto == response.data.resultado[parseInt(j)].id_produto_pai) {
                                    $scope.listaProdutosReceita[parseInt(i)].prodFilhos.
                                        push({
                                            id_produto: response.data.resultado[parseInt(j)].id_produto_filho,
                                            descricao: response.data.resultado[parseInt(j)].descricao,
                                            quantidade: response.data.resultado[parseInt(j)].quantidade
                                        })
                                }
                            }
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            else if (qtdSelecionado == qtdParticao && qtdParticao == 0) {
                $scope.relatorioReceita = true;
                for (var j in $scope.iniciaisProdutos) {
                    if ($scope.iniciaisProdutos[parseInt(j)].produtosPai != undefined) {
                        if ($scope.iniciaisProdutos[parseInt(j)].produtosPai.length > 0) {
                            for (var i in $scope.iniciaisProdutos[parseInt(j)].produtosPai) {
                                var auxP = $scope.iniciaisProdutos[parseInt(j)].produtosPai[parseInt(i)];
                                idProdsPai += auxP.id_produto + " ,";
                                $scope.listaProdutosReceita.push({
                                    id_produto: auxP.id_produto, descricao: auxP.descricao, prodFilhos: []
                                });
                            }

                        }
                    }
                }
                idProdsPai = idProdsPai.substring(0, (idProdsPai.length - 1));
                $http({
                    method: 'GET',
                    url: $rootScope.raiz_ws + 'produto/itensfilhosreceita',
                    params: {
                        id_produto: idProdsPai
                    }
                }).then(function successCallback(response) {
                    if (response.data.resultado !== undefined) {
                        for (var i in $scope.listaProdutosReceita) {
                            for (var j in response.data.resultado) {
                                if ($scope.listaProdutosReceita[parseInt(i)].id_produto == response.data.resultado[parseInt(j)].id_produto_pai) {
                                    $scope.listaProdutosReceita[parseInt(i)].prodFilhos.
                                        push({
                                            id_produto: response.data.resultado[parseInt(j)].id_produto_filho,
                                            descricao: response.data.resultado[parseInt(j)].descricao,
                                            quantidade: response.data.resultado[parseInt(j)].quantidade
                                        })
                                }
                            }
                        }
                        console.log($scope.listaProdutosReceita);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });

            }
            else {
                alertify.alert('Selecione todos os sabores!');
            }
        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.retornaInicioReceita = function () {
        try {
            for (var i in $scope.iniciaisProdutos) {
                $scope.iniciaisProdutos[parseInt(i)].selecionada = false;
            }
            iniciaParticao();
            limpaSaborEscolhido();
            $scope.produtosTela = [];

            $scope.relatorioReceita = false;
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };
    $scope.retornaInicio = function () {
        try {
            alertify.confirm('Deseja sair da tela de receitas?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                $scope.$apply(function () {
                    $location.path("/#").replace();
                })
            });
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.alterarFonte = function (opcao) {
        try {
            for (var i in $scope.listaProdutosReceita) {
                var el = document.getElementById('receita-'+i.toString());
                var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
                var fontSize = parseFloat(style); 
    
                if (opcao === 1) {
                    fontSize = fontSize + 2;
                    fontSize = fontSize + 'px';
                    el.style.fontSize = fontSize;
                    el.style.fontStyle.fontSize = fontSize;
                }else {
                    fontSize = fontSize - 2;
                    fontSize = fontSize + 'px';
                    el.style.fontSize = fontSize;
                }
                var el = document.getElementById('receitaTitulo-'+i.toString());
                var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
                var fontSize = parseFloat(style); 
    
                if (opcao === 1) {
                    fontSize = fontSize + 2;
                    fontSize = fontSize + 'px';
                    el.style.fontSize = fontSize;
                }else {
                    fontSize = fontSize - 2;
                    fontSize = fontSize + 'px';
                    el.style.fontSize = fontSize;
                }
            }
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

});
