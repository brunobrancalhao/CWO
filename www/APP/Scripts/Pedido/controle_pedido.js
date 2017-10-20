APACwo.service('service_pedido', function () {
    var pedido = {};
    return {
        setAtendente: function (atendente) {
            this.atendente = atendente;
        }
    }
});
APACwo.controller('controle_pedido', function ($scope, $rootScope, $timeout, $http, $location, $window, aux, service_pedido, Poller, service_produto_opcao, factory_produto_opcao, factory_personalizar, factory_rodizio, service_controle_rodizio) {

    $rootScope.maxProdutos = 50;//parametro de quantidade máxima de itens por pedido
    $scope.listaFuncionario = [];
    var existeRodizioNoPedido = false;

    $scope.init = function (fase) {
        if (fase === 1) {
            $rootScope.nomeTela = 'Atendente';
            buscarListaFuncionario();

            //service_pedido.pedido = {};
            if (service_pedido.pedido === undefined) {
                service_pedido.pedido = {};
            } else {
                if (service_pedido.pedido.telaConsultaMesa)
                    $scope.pedido = service_pedido.pedido;
                else
                    service_pedido.pedido = {};
            }
        }
        else if (fase === 2) {
            $rootScope.nomeTela = 'Mesa';
            //$("#input_ci").focus();
            buscarMapaMesa();
            if (service_pedido.pedido !== undefined) {
                if (service_pedido.pedido.telaConsultaMesa) {
                    $scope.pedido = service_pedido.pedido;
                    $location.path("/pedido/informar_produto").replace();
                }
                else {
                    var atendente = service_pedido.pedido.atendente;
                    service_pedido.pedido = {};
                    service_pedido.pedido.atendente = atendente;
                    $scope.pedido = service_pedido.pedido;
                }
            } else {
                $location.path("/pedido/atendente").replace();
            }
        }
        else if (fase === 3) {
            $rootScope.nomeTela = 'Pedido';
            factory_personalizar.novo();
            service_pedido.pedido.telaConsultaMesa = false;
            if (service_pedido.pedido !== undefined) {
                $scope.pedido = service_pedido.pedido;
                if ($scope.pedido.produtos === undefined) {
                    $scope.pedido.produtos = [];
                }
                if (service_pedido.pedido.produtos !== undefined) {
                    for (var i = 0; i < service_pedido.pedido.produtos.length; i++) {
                        if (service_pedido.pedido.produtos[i].valor_venda === undefined && (service_pedido.pedido.produtos[i].tipo_produto === "I" || service_pedido.pedido.produtos[i].tipo_produto === "R"))
                            service_pedido.pedido.produtos[i].valor_venda = service_pedido.pedido.produtos[i].valor_produto
                    }
                }
            } else {
                $location.path("/pedido/atendente").replace();
            }
            $("#input_num_produto").focus();
        }
    };

    $scope.enviarAtendente = function (funcionario) {
        try {
            service_pedido.pedido.atendente = funcionario;
            $location.path("pedido/informar_ci").replace();
        }
        catch (e) {
            alertify.alert(e);
        }
    };

    function buscarListaFuncionario() {
        try {
            $http({
                method: 'GET',
                url: $rootScope.raiz_ws + 'pessoa/funcionario'
            }).then(function successCallback(response) {
                $scope.listaFuncionario = response.data.resultado;
            }, function errorCallback(response) {
                console.log(response);
                alertify.error(response.data)
            });
        }
        catch (e) {
            alertify.alert(e);
        }
    };

    $scope.enviarCI = function (mesa) {
        try {
            if (aux.validaString(mesa.ci)) {
                service_pedido.pedido.ci = mesa.ci;

                $scope.verificarMesaCI(mesa.ci, true).then(function (retorno) {
                    var pedido_retornado = retorno;
                    if (!pedido_retornado.fechar_mesa) {
                        service_pedido.pedido.id_pedido = pedido_retornado.id_pedido;
                        $location.path("/pedido/informar_produto").replace();
                    }
                });
            }
        } catch (e) {
            alertify.alert(e.message);
            //$("#input_ci").focus();
        }
    };

    function buscarMapaMesa() {
        try {
            $http({
                method: 'GET',
                url: $rootScope.raiz_ws + 'mesa/mapa'
            }).then(function successCallback(response) {
                $scope.listaMapaMesa = response.data.resultado;
            }, function errorCallback(response) {
                console.log(response);
                alertify.error(response.data)
            });
        }
        catch (e) {
            alertify.alert(e);
        }
    };

    $scope.adicionarProduto = function () {
        try {
            if ($scope.pedido === undefined) {
                $location.path("/pedido/atendente").replace();
                throw (new Error("Pedido inválido!"));
            } else {
                if ($scope.pedido.produtos.length < $rootScope.maxProdutos) {
                    if (!aux.validaString($scope.num_produto)) {
                        throw "Favor digite o código do produto";
                        $("#input_num_produto").focus();
                    }

                    $scope.quantidade = 1;

                    return $http({
                        method: 'GET',
                        url: $rootScope.raiz_ws + 'produto',
                        params: {
                            num_produto: $scope.num_produto
                        }
                    }).then(function successCallback(response) {
                        if (response.status === 204) {
                            alertify.warning("Item Não Localizado!");
                        }
                        else {
                            $scope.produto = response.data.resultado[0];

                            if ($scope.produto.subgrupo.descricao === "VARIAÇÃO") {
                                //verifica se há produtos para adicionar a variação
                                if ($scope.pedido.produtos.length !== 0) {
                                    //atribuir id_pai
                                    if ($scope.produto.variacao === undefined || $scope.produto.variacao === "" || $scope.produto.variacao === null)
                                        $scope.produto.variacao = "ADICIONAR";

                                    $("#modal_variacao").modal("show");
                                    $(".btn_salvar_produto_variacao").focus();
                                    alertify.success($scope.produto.descricao + ' inserido com sucesso');
                                }
                                else {
                                    alertify.alert("Insira um produto antes de adicionar uma variação!");
                                }
                            }
                            else if ($scope.produto.tem_opcao === 'SIM') {
                                $scope.produto.tela = 'PEDIDO';
                                $scope.produto.chaveTela = undefined;
                                factory_produto_opcao.produto = $scope.produto;
                                service_produto_opcao.execute($scope.produto);
                                $scope.num_produto = "";
                            }
                            else {
                                $scope.adicioar_produto_lista($scope.produto);
                                $("#input_num_produto").focus();
                                alertify.success($scope.produto.descricao + ' inserido com sucesso');
                            }
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                        alertify.error(response.data.msgErro)
                    });

                }
                else {
                    alertify.alert('Quantidade de produtos excedida, favor enviar o pedido!');
                }
            }
        }
        catch (e) {
            alertify.alert(e);
        }
    };

    $scope.verifica_quantidade = function (produto) {
        $scope.clicked = true;
        if (produto.quantidade >= $rootScope.max_quant) {
            alertify.confirm('Deseja manter ' + produto.quantidade + ' unidades de ' + produto.descricao + ' ?').set('labels', { ok: 'SIM', cancel: 'NÃO' })
                .set('oncancel', function () {
                    $scope.$apply(function () {
                        if ($scope.clicked) {
                            produto.quantidade = 1;
                            $scope.clicked = false;
                        }
                    });
                }).set('onok', function () {
                    $scope.clicked = false;
                }).set('labels', { ok: 'SIM', cancel: 'NÃO' });
        } else if (produto.quantidade <= 0) {
            produto.quantidade = 1;
            $scope.clicked = false;
        }
        else {
            $scope.clicked = false;
        }
    };

    $scope.confirmaImpressao = function () {
        $timeout(function () {
            if (!$scope.clicked) {
                if (aux.validaArray($scope.pedido.produtos)) {
                    alertify.confirm('Confirma envio do pedido?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                        $scope.$apply(function () {
                            $scope.verificarMesaCI(service_pedido.pedido.ci, false).then(function (retorno) {
                                if (retorno.id_pedido > 0 && retorno.id_pedido != service_pedido.pedido.id_pedido) {
                                    alertify.confirm('Já existe um pedido para esta mesa. Deseja adicionar produtos ao pedido já existente?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                                        $scope.pedido.id_pedido = retorno.id_pedido;
                                        $timeout(function () {
                                            $scope.pedido.imprimir = true;
                                            $scope.enviarPedido();
                                        }, 200)
                                    })
                                }
                                else {
                                    $scope.pedido.imprimir = true;
                                    $scope.enviarPedido();
                                }
                            })
                        })
                    });
                } else {
                    alertify.alert('Favor adicionar produtos para poder finalizar!');
                }
            }
        }, 50);
    };

    $scope.enviarPedido = function () {
        try {

            vinculaProdutosVariacao();

            var pedido = carregaPedido($scope.pedido);

            $http({
                method: 'POST',
                url: $rootScope.raiz_ws + 'pedido',
                data: pedido
            }).then(function successCallback(response) {

                alertify.success("Pedido Gravado com Sucesso!");
                var atendente = { atendente: $scope.pedido.atendente };
                $scope.limpar();
                service_pedido.pedido = atendente;

                $location.path("/pedido/informar_ci").replace();

            }, function errorCallback(response) {
                alertify.error(response.data);
                console.log(response);
            });

        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.verificarMesaCI = function (comanda, gerar_id) {
        return $http({
            method: 'GET',
            url: $rootScope.raiz_ws + 'pedido/pedido_ci',
            params: {
                num_pedido: comanda,
                gerar_id: gerar_id
            }
        }).then(function successCallback(response) {
            var pedido_retornado = response.data.resultado;
            if (pedido_retornado.fechar_mesa) {
                alertify.alert("A Conta ja foi fechada! Favor finalizar a mesa para poder lançar produtos novamente!");
                //$scope.limpar();
            }

            return response.data.resultado;
        }, function errorCallback(response) {
            console.log(response);
            alertify.error(response.data)
        });
    };

    $scope.remover_quant_produto = function (produto) {
        if (!$scope.clicked) {
            if (produto.quantidade - 1 <= 0) {
                alertify.confirm('Confirma a exclusão deste item?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                    $scope.$apply(function () {
                        $scope.excluir_produto(produto);
                    })
                })
            } else {
                produto.quantidade -= 1;
            }
        }
    };

    $scope.adicionar_quant_produto = function (produto) {
        if (produto.quantidade >= $rootScope.max_quant) {
            alertify.confirm('Deseja realmente adicionar mais unidades?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                $scope.$apply(function () {
                    produto.quantidade += 1;
                })
            });
        }
        else {
            produto.quantidade += 1;
        }
    };

    $scope.excluir_produto = function (produto) {
        if (produto.variacao === "SABOR") {
            $scope.excluir_produto({ id_temp: produto.id_pai });
        } else {
            if (!aux.validaString(produto.variacao)) {
                for (var i = $scope.pedido.produtos.length; i > 0; i--) {
                    var produto_alvo = $scope.pedido.produtos[i - 1];
                    if (produto_alvo.id_pai !== undefined && produto_alvo.id_pai === produto.id_temp) {
                        $scope.pedido.produtos.splice(i - 1, 1);
                    }
                }
            }
            for (var i = $scope.pedido.produtos.length; i > 0; i--) {
                var produto_alvo = $scope.pedido.produtos[i - 1];
                if (produto_alvo.id_temp === produto.id_temp) {
                    //limpar variações
                    var count = 1;
                    if (!aux.validaString(produto_alvo.variacao)) {//produto alvo não é variação.
                        for (var j = i; j < $scope.pedido.produtos.length; j++) {
                            if (aux.validaArray($scope.pedido.produtos[j]) && aux.validaString($scope.pedido.produtos[j].variacao)) {
                                count += 1;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    $scope.pedido.produtos.splice(i - 1, count);
                }
            }
        }
    };

    $scope.limpar = function () {
        service_pedido.pedido = undefined;
        $scope.pedido = undefined;
        $scope.ci = undefined;
        $scope.atendente = undefined;
    };

    $scope.focoQuantidade = function () {
        $("#input_quantidade").focus();
    };

    $scope.cancelarPedido = function () {
        $timeout(function () {
            if (!$scope.clicked) {
                alertify.confirm('Deseja realmente cancelar o pedido?').set('labels', { ok: 'SIM', cancel: 'NÃO' }).set('onok', function () {
                    $scope.$apply(function () {
                        $scope.limpar();
                        $location.path("/pedido/atendente").replace();
                    })
                });
            }
        }, 50)
    };

    $scope.adicioar_produto_lista = function (produto) {
        try {
            produto.quantidade = $scope.quantidade;
            var encontrado = false;
            if (!encontrado) {
                if (!aux.validaArray($scope.pedido.produtos)) {
                    produto.ordem = 0;
                } else {
                    produto.ordem = $scope.pedido.produtos.length;
                }
                produto.valor_venda = produto.valor_produto;
                produto.id_temp = aux.gerarRandomKey();
                $scope.pedido.produtos.push(produto);
            }
            $scope.num_produto = "";
            $scope.quantidade = "";
            $("#input_num_produto").focus();

        } catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.adicionar_observacao = function (produto) {
        $("#modal_observacao").modal("show");
        $scope.produto_obs_modal = produto;
        $("#inputLarge").focus();
    };

    $scope.buscar_produto = function buscar_produto() {
        $location.path("/produto/consultar_produto").replace();
    };

    $scope.isSabor = function (produto) {
        try {
            if (produto.variacao === "SABOR")
                return true;
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    function fabrica_objeto_produto() {
        var produto = {};
        if (!aux.validaString($scope.num_produto)) {
            throw "Favor digite o código do produto";
            $("#input_num_produto").focus();
        }
        if (!aux.validaNumero($scope.quantidade)) {
            $scope.quantidade = 1;
        }
        produto = {
            num_produto: $scope.num_produto,
            quantidade: $scope.quantidade
        };
        return produto;
    };

    function vinculaProdutosVariacao() {
        try {
            if (aux.validaArray($scope.pedido.produtos)) {
                for (var x = 0; x < $scope.pedido.produtos.length; x++) {
                    var produto = $scope.pedido.produtos[x];
                    //VARIAÇÃO SEM VINCULO A NENHUM PRODUTO
                    if ((produto.id_pai === 0 || produto.id_pai === undefined || produto.id_pai === null) && produto.variacao === "ADICIONAR" || produto.variacao === "RETIRAR" || produto.variacao === "ITEM") {
                        if (x > 0) {
                            var produto_anterior = $scope.pedido.produtos[x - 1];
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
                }
            }
        }
        catch (e) {
            throw e;
        }
    };

    function carregaPedido(pedido) {
        try {
            var pd = {};
            var pdi = [];

            pd.id_pedido = pedido.id_pedido;
            pd.ci = pedido.ci;
            pd.imprimir = pedido.imprimir;
            pd.id_atendente = pedido.atendente.id;

            for (var x = 0; x < pedido.produtos.length; x++) {
                pdi[x] = {
                    id_temp: pedido.produtos[x].id_temp === undefined ? 0 : pedido.produtos[x].id_temp,
                    id_pai: pedido.produtos[x].id_pai === undefined ? 0 : pedido.produtos[x].id_pai,
                    qtd_item: pedido.produtos[x].quantidade,
                    valor_item: pedido.produtos[x].valor_venda,
                    variacao: pedido.produtos[x].variacao === undefined ? "" : pedido.produtos[x].variacao,
                    observacao: pedido.produtos[x].observacao === undefined ? "" : pedido.produtos[x].observacao,
                    id_opcao: pedido.produtos[x].id_opcao === undefined ? 0 : pedido.produtos[x].id_opcao,
                    opcao: pedido.produtos[x].opcao === undefined ? 0 : pedido.produtos[x].opcao,
                    particao: pedido.produtos[x].particao === undefined ? "" : pedido.produtos[x].particao,
                    incide_taxa_servico: pedido.produtos[x].incide_taxa_servico,
                    produto: { id_produto: pedido.produtos[x].id_produto }
                }
            }
            pd.pedidoitem = pdi;
            return pd;
        } catch (e) {
            throw e;
        }
    }

    $scope.RodizioNoPedido = function () {
        try {
            if ($scope.pedido != undefined) {
                if (!existeRodizioNoPedido) {
                    existeRodizioNoPedido = false;
                    for (var i in $scope.pedido.produtos) {
                        if ($scope.pedido.produtos[parseInt(i)].tipo_produto == 'R') {
                            existeRodizioNoPedido = true;
                            return true;
                        }
                    }
                    if ($scope.retornoRoizioPedido == undefined) {
                        if (existeRodizioNoPedido == false) {
                            $scope.retornoRoizioPedido = {};
                            $http({
                                method: 'GET',
                                url: $rootScope.raiz_ws + 'pedido/busca_rodizio',
                                params: {
                                    id_pedido: $scope.pedido.id_pedido
                                }
                            }).then(function successCallback(response) {
                                $scope.retornoRoizioPedido = response.data.resultado;
                                if ($scope.retornoRoizioPedido == "1") {
                                    existeRodizioNoPedido = true;
                                    return true;
                                }
                            }, function errorCallback(response) {
                                console.log(response);
                            });
                        }
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        } catch (e) {
            throw e;
        }
    };

    $scope.carregaTelaRodizio = function () {
        try {
            $timeout(function () {
                if (!$scope.clicked) {
                    factory_rodizio.produto = $scope.produto;
                    service_controle_rodizio.execute($scope.produto, $scope.pedido);
                    $scope.num_produto = "";
                }
            }, 50)
        } catch (e) {
            throw e;
        }
    };
});