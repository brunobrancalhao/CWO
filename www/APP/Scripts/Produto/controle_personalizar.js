APACwo.factory('factory_personalizar', function () {
    var produto = {};
    return {
        execute: function() {
            return;
        },
        novo: function () {
            this.id_grupo_produto = undefined;
            this.id_sub_grupo_produto = undefined;
            this.personalizacao = undefined;
            this.opcao_selecionada = undefined;
        }
    }

});

APACwo.controller('controle_personalizar', function ($scope, $rootScope, $http, $location, aux, factory_personalizar, service_pedido) {
    $rootScope.nomeTela = 'Personalizar';
    $scope.init_produto_personalizado = function () {

        if (service_pedido.pedido === undefined) {
            $location.path("/pedido/atendente").replace();
        } else {
            if (factory_personalizar.opcao_selecionada === undefined) {
                factory_personalizar.opcao_selecionada = factory_personalizar.produto.opcao_selecionada;
            }
            //PRODUTO BASE EXISTE
            if (factory_personalizar.produto !== undefined) {
                $scope.produto = factory_personalizar.produto;
                //VERIFICA SE É SABOR
                if (aux.validaArray($scope.produto.opcoes)) {
                    for (var i = 0; i < $scope.produto.opcoes.length; i++) {
                        var opcao = $scope.produto.opcoes[i];
                        if (opcao.posicao === factory_personalizar.opcao_selecionada && opcao.op_status === 'SIM' && opcao.op_valor > 0) {
                            $scope.produto.id_temp = aux.gerarRandomKey();
                            $scope.produto.valor_venda = opcao.op_valor;
                            encontrado = true;
                            $scope.pesquisado_produto = true;
                        }
                    }
                }
                $scope.lancamento_particao = $scope.produto.total_particoes;
                $scope.produto_pesq = $scope.produto;

                if (factory_personalizar.consulta_produto_personalizado) {
                    $scope.personalizacao = factory_personalizar.personalizacao;
                    $scope.lancamento_particao = $scope.personalizacao.restante_particoes;
                    factory_personalizar.consulta_produto_personalizado = false;
                } else {
                    $scope.personalizacao = { produto_base: $scope.produto, restante_particoes: $scope.produto.total_particoes, total_particoes: $scope.produto.total_particoes };
                }
                $scope.num_produto = parseInt($scope.produto.num_produto);
                setTimeout(function () {
                    $("#input_lanc_part").focus();
                }, 500);
            } else {

                $location.path("/pedido/informar_produto").replace();
            }
        }

    };

    $scope.consultaProduto = function () {
        try {
            if ($scope.num_produto === null || $scope.num_produto === undefined || $scope.num_produto === ''){
                alertify.alert('Necessário informar um produto!');
            }
            else {
                $http({
                        method: 'GET',
                        url: $rootScope.raiz_ws + 'produto/produtoopcao' ,
                        params: {
                            id_grupo : $scope.personalizacao.produto_base.grupo.id,
                            id_subgrupo: $scope.personalizacao.produto_base.subgrupo.id,
                            id_produto: 0,
                            num_produto: $scope.num_produto
                        }
                    }).then(function successCallback(response) {
                        if (response.data.resultado !== undefined){
                            if ($scope.personalizacao.produtos.length < 50) {
                                $scope.produto_pesq = response.data.resultado[0];

                                $scope.produto_pesq.id_temp = aux.gerarRandomKey();
                                //CASO SEJA VARIAÇÃO
                                if ($scope.produto_pesq.subgrupo.descricao === "VARIAÇÃO") {
                                    $scope.produto_pesq.variacao = "ADICIONAR";
                                    $("#modal_variacao").modal("show");
                                    $(".btn_salvar_produto_variacao").focus();
                                }
                                    //VALIDA SE TEM A OPÇÃO CORRETA
                                else if ($scope.produto_pesq.tem_opcao === 'SIM' && $scope.produto_pesq.opcoes.length > 0) {
                                    var encontrado = false;
                                    for (var i = 0; i < $scope.produto_pesq.opcoes.length; i++) {
                                        var opcao = $scope.produto_pesq.opcoes[i];
                                        if (opcao.posicao === $scope.personalizacao.produto_base.opcao_selecionada && opcao.op_status === 'SIM' && opcao.op_valor > 0) {
                                            $scope.produto_pesq.valor_venda = opcao.op_valor;
                                            encontrado = true;
                                            $scope.pesquisado_produto = true;
                                            $("#input_lanc_part").focus();
                                        }
                                    }
                                    if (!encontrado) {
                                        limpar();
                                        alertify.alert("Produto não possui as parametrizações corretas!");
                                    }
                                }
                                else {
                                    alertify.alert("Produto inválido!");
                                }


                            }
                            else {
                                alertify.alert('Quantidade de produtos excedida, favor enviar o pedido!');
                            }
                        }
                            
                    }, function errorCallback(response) {
                        console.log(response);
                        alertify.alert("O Produto não localizado! Verifique se este produto pertence ao mesmo Grupo/SubGrupo do produto atual!");
                    });
            }

        }
        catch (e) {
            limpar();
            alertify.alert(e.message);
        }
    };

    $scope.adicionar = function () {
        try {
            if (!aux.validaArray($scope.personalizacao.produtos)) {
                $scope.personalizacao.produtos = [];
            }
            if ($scope.produto_pesq === undefined || $scope.produto_pesq === null) {
                $("#input_num_produto").focus();
                throw new Error("Favor pesquise um produto para incluir no particionamento!");
            }
            $scope.lancamento_particao = parseInt($scope.lancamento_particao);
            if (!aux.validaString($scope.produto_pesq.variacao)) {
                if ($scope.personalizacao.restante_particoes > 0
                    && $scope.lancamento_particao <= $scope.personalizacao.restante_particoes
                    && $scope.lancamento_particao > 0
                    && $scope.personalizacao.produto_base.subgrupo.id === $scope.produto_pesq.subgrupo.id) {
                        $scope.personalizacao.restante_particoes -= $scope.lancamento_particao;
                        $scope.produto_pesq.particao_valor = $scope.lancamento_particao;
                        $scope.produto_pesq.particao = $scope.lancamento_particao + "/" + $scope.personalizacao.total_particoes;
                        $scope.produto_pesq.valor_venda = $scope.produto_pesq.valor_venda.toFixed(2);
                        $scope.personalizacao.produtos.push(aux.clone($scope.produto_pesq));
                        limpar();
                        $scope.lancamento_particao = $scope.personalizacao.restante_particoes;
                } else {
                    $scope.lancamento_particao = $scope.personalizacao.restante_particoes;
                    if ($scope.personalizacao.produto_base.id_subgrupo_produto !== $scope.produto_pesq.id_subgrupo_produto) {
                        throw new Error("Produto não pertence ao mesmo Subgrupo.");

                    } else {
                        throw new Error("O Valor excede o limite de partições do produto ou é inválido!");
                    }
                }
            } else {
                if ($scope.personalizacao.produtos.length === 0) {
                    throw new Error("Você não pode incluir uma variação sem um item para recebe-la!")
                }
                var ultima_pos = $scope.personalizacao.produtos.length - 1;
                if ($scope.personalizacao.produtos[ultima_pos].id_pai !== undefined) {
                    $scope.produto_pesq.id_pai = $scope.personalizacao.produtos[ultima_pos].id_pai;
                } else {
                    $scope.produto_pesq.id_pai = $scope.personalizacao.produtos[ultima_pos].id_temp;
                }
                $scope.produto_pesq.valor_venda = $scope.produto_pesq.valor_venda.toFixed(2);
                $scope.personalizacao.produtos.push($scope.produto_pesq);
                limpar();
            }

            $("#input_num_produto").focus();
            calcula_total();

        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.finalizar = function () {
        try {
            if (aux.validaArray($scope.personalizacao.produtos)) {
                if (!aux.validaArray(service_pedido.pedido.produtos)) {
                    service_pedido.pedido.produtos = [];
                }

                //CORREÇÃO NOME PRODUTO BASE
                $scope.personalizacao.produto_base.descricao = $scope.personalizacao.produto_base.subgrupo.descricao + " " + $scope.personalizacao.produto_base.descricao_opcao;
                $scope.personalizacao.produto_base.opcoes = undefined;
                $scope.personalizacao.produto_base.valor_venda = $scope.personalizacao.total_produtos//.toString().replace(".", ",");
                $scope.personalizacao.produto_base.quantidade = 1;
                $scope.personalizacao.produto_base.particao = undefined;
                $scope.personalizacao.produto_base.opcao = $scope.personalizacao.produto_base.opcao_selecionada;
                service_pedido.pedido.produtos.push($scope.personalizacao.produto_base);
                for (var x = 0; x < $scope.personalizacao.produtos.length; x++) {
                    var produto_part = aux.clone($scope.personalizacao.produtos[x]);
                    produto_part.$$hashKey = produto_part.id_temp;
                    produto_part.opcoes = undefined;
                    produto_part.quantidade = 1;
                    produto_part.id_pai = $scope.personalizacao.produto_base.id_temp;
                    if (!aux.validaString(produto_part.variacao)) {
                        produto_part.valor_venda = 0;
                        produto_part.variacao = "SABOR";
                    }
                    produto_part.valor_venda = produto_part.valor_venda//.toString().replace(".", ",");
                    produto_part.opcao = undefined;
                    if (aux.validaString(produto_part.particao)) {
                        produto_part.descricao = produto_part.particao + " " + produto_part.descricao;
                    }
                    service_pedido.pedido.produtos.push(produto_part);
                }
                $scope.retornar();
            }
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.remover = function (produto) {
        try {
            for (var i = $scope.personalizacao.produtos.length; i > 0; i--) {
                var produto_alvo = $scope.personalizacao.produtos[i - 1];
                if (produto_alvo.id_pai !== undefined && produto_alvo.id_pai === produto.id_temp) {
                    $scope.personalizacao.produtos.splice(i - 1, 1);
                }
            }
            for (var i = $scope.personalizacao.produtos.length; i > 0; i--) {
                var produto_alvo = $scope.personalizacao.produtos[i - 1];
                if (produto_alvo.id_temp === produto.id_temp) {
                    $scope.personalizacao.produtos.splice(i - 1, 1);
                }
            }
            if ($scope.personalizacao.restante_particoes === undefined) {
                $scope.restante_particoes = 0;
            }
            $scope.personalizacao.restante_particoes += produto.particao_valor;
            $scope.lancamento_particao = $scope.personalizacao.restante_particoes;
            calcula_total();
        }
        catch (e) {
            alertify.alert(e.message);
        }
    };

    $scope.buscar_produto = function () {
        factory_personalizar.consulta_produto_personalizado = true;
        factory_personalizar.id_grupo_produto = $scope.personalizacao.produto_base.grupo.id;
        factory_personalizar.id_sub_grupo_produto = $scope.personalizacao.produto_base.subgrupo.id;
        factory_personalizar.personalizacao = $scope.personalizacao;
        $location.path("/produto/consultar_produto").replace();
    };

    $scope.adicionar_observacao = function (produto) {
        $scope.produto_selecionado = produto;
        $("#modal_observacao").modal("show");
    };

    $scope.retornar = function () {
        factory_personalizar.novo();
        $location.path("/pedido/informar_produto").replace();
    };

    function limpar() {
        $scope.pesquisado_produto = false;
        $scope.produto_pesq = {};
        $scope.num_produto = "";
    };

    function calcula_total() {
        try {
            if (aux.validaArray($scope.personalizacao.produtos)) {
                $scope.personalizacao.total_produtos = 0;
                $scope.personalizacao.total_variacao = 0;
                for (var x = 0 ; x < $scope.personalizacao.produtos.length; x++) {
                    var produto = $scope.personalizacao.produtos[x];
                    //É UMA PARTIÇÃO
                    if (!aux.validaString(produto.variacao)) {
                        if (produto.valor_venda > $scope.personalizacao.total_produtos) {
                            $scope.personalizacao.total_produtos = parseFloat(produto.valor_venda);
                        }
                    } else {
                        if (produto.variacao === "ADICIONAR") {
                            $scope.personalizacao.total_variacao += parseFloat(produto.valor_venda);
                        }
                    }
                }
                $scope.personalizacao.total = parseFloat($scope.personalizacao.total_produtos) + $scope.personalizacao.total_variacao;
                $scope.personalizacao.total = parseFloat($scope.personalizacao.total).toFixed(2);
            }
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

});