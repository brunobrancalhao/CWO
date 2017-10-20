APACwo.factory('Poller', function ($http, $timeout, $rootScope) {
    var data = { response: {}, calls: 0 };
    var poller = function () {
        /*$http.post($rootScope.raiz_ws + 'Home/ping', $rootScope.sessao_id).then(function (resultado) {
            data.response = resultado.data;
            data.calls++;
            $timeout(poller, 5000);
            console.log(data);
        });*/
    };
    poller();

    return {
        data: data
    };
});