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
                $scope.listApacs[parseInt(i)].DataConsulta = formata($scope.listApacs[parseInt(i)].DataConsulta);
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
                $scope.listproc[parseInt(i)].DataConsulta = formata($scope.listproc[parseInt(i)].DataConsulta);
            };

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    var formata = function (data) {
        var d = new Date,
        dformat = [d.getMonth()+1,
                   d.getDate(),
                   d.getFullYear()].join('/')+' '+
                  [d.getHours(),
                   d.getMinutes(),
                   d.getSeconds()].join(':');
                   return dformat;

    };

});