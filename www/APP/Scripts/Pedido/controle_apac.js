APACwo.controller('controle_apac', function ($scope, $rootScope, $http, $location, $filter, aux, Poller) {
    $scope.init = function () {
        $rootScope.nomeTela = 'Apac';
        $http({
            method: 'GET',
            url: $rootScope.link_apis + 'ApacEstadoAtual',
            params: {
                cartaoSus: $scope.usuario.cartaoSus
            }
        }).then(function successCallback(response) {
            $scope.listApacs = response.data.response[0];
            for (var i in $scope.listApacs) {
                $scope.listApacs[parseInt(i)].DataConsulta = fndata($scope.listApacs[parseInt(i)].DataConsulta);
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.carregarProcedimentos = function(controle) {
        $("#modal_procedimentos").modal("show");
        $http({
            method: 'GET',
            url: $rootScope.link_apis + 'consultarAPAC',
            params: {
                cartaoSus: $scope.usuario.cartaoSus,
                chave: controle
            }
        }).then(function successCallback(response) {
            $scope.listproc = response.data.response[0];
            for (var i in $scope.listproc) {
                $scope.listproc[parseInt(i)].DataConsulta = fndata($scope.listproc[parseInt(i)].DataConsulta);
            };

        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var fndata = function(pdata){
        var data = new Date(pdata);
        var dia = data.getDate(); dia = zeroAEsquerda(dia, 2);
        var mescru = data.getMonth();var mes = data.getMonth(); mes += 1; mes = zeroAEsquerda(mes, 2);
        var ano = data.getFullYear();
        var dataAtual = dia+'/'+mes+'/'+ano;
        // var horaAtual       = zeroAEsquerda(data.getHours(),2);          // 0-23
        // var minutoAtual     = zeroAEsquerda(data.getMinutes(),2);        // 0-59
        // var segundoAtual    = zeroAEsquerda(data.getSeconds(),2);        // 0-59
        return ('Data: '+dia+'/'+mes+'/'+ano);
    }

    function zeroAEsquerda(str, length) {
      const resto = length - String(str).length;
      return '0'.repeat(resto > 0 ? resto : '0') + str;
    }

});