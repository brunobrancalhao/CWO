APACwo.factory('factory_logoff', function ($rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
	return {
		logoff: function () {
			alertify.confirm("Deseja realmente sair?").set('labels', { ok: 'SIM', cancel: 'NÃO' })
				.set('onok', function () {
					$rootScope.$apply(function () {
						$rootScope.usuario = { logado: false };
						$localStorage.usuario = { logado: false };
						$cookies.put('cartaoSus', "")
					})
				})
		}
	}
});

APACwo.controller('controle_apoio', function ($scope, $rootScope, $http, $cookies, aux, $location, $timeout, $localStorage) {
	$rootScope.nomeTela = 'APOIO';

		$scope.apoio = function(param) {
				var pre = document.createElement('pre');
					pre.style.maxHeight = "400px";
					pre.style.margin = "0";
					pre.style.padding = "24px";
					pre.style.whiteSpace = "pre-wrap";
					pre.style.textAlign = "left";
					if(param == "aion"){
						pre.appendChild(document.createTextNode($('#aion').text()));
					}
					else if(param == 'ernetwork'){
						pre.appendChild(document.createTextNode($('#ernetwork').text()));
					}
					else if(param == 'irroba'){
						pre.appendChild(document.createTextNode($('#irroba').text()));
					}
					else if(param == 'smn'){
						pre.appendChild(document.createTextNode($('#smn').text()));
					}
					else if(param == 'chb'){
						pre.appendChild(document.createTextNode($('#chb').text()));
					}
					else if(param == 'jrti'){
						pre.appendChild(document.createTextNode($('#jrti').text()));
					}
					else{
						pre.appendChild(document.createTextNode($('#eddydata').text()));
					}


				if(param == "aion"){
					alertify.confirm(pre, function(param){
				 window.open('http://www.aion.eng.br', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else if(param == "ernetwork"){
					alertify.confirm(pre, function(param){
				 window.open('http://ernetwork.com.br/', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else if(param == "irroba"){
					alertify.confirm(pre, function(param){
				 window.open('http://irroba.com.br/', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else if(param == "smn"){
					alertify.confirm(pre, function(param){
				 window.open('http://www.smn.com.br/', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else if(param == "chb"){
					alertify.confirm(pre, function(param){
				 window.open('http://www.chb.com.br/', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else if(param == "jrti"){
					alertify.confirm(pre, function(param){
				 window.open('http://www.jrti.com.br/', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}
				else{
					alertify.confirm(pre, function(param){
				 window.open('http://www.eddydata.com.br', '_system', 'location=yes'); return false; },function(){})
				.set({labels:{ok:'Ir ao site', cancel: 'Voltar'}, padding: false});	
				}



				
				
			}

			, function errorCallback(response) {
            alertify.error(response.data);

            $timeout(function () {
                location.reload();
            }, 500)
    };
	
});

