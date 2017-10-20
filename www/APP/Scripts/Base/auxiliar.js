APACwo.service('aux', function () {
    return {
        gerarRandomKey: function () {
            return Math.floor((Math.random() * 10000) + 1);
        },
        getDataAtual: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = dd + '/' + mm + '/' + yyyy;
            return today;
        },
        validaString: function (string) {
            if (string === undefined) {
                return false;
            }
            if (string === "") {
                return false;
            }
            if (string === null) {
                return false;
            }
            return true;
        },
        validaArray: function (array) {
            if (array === undefined) {
                return false;
            }
            if (array === null) {
                return false;
            }
            if (array.length <= 0) {
                return false;
            }
            return true;
        },
        validaNumero: function (numero) {
            if (numero === undefined) {
                return false;
            }
            return !isNaN(parseFloat(numero)) && isFinite(numero);
        },
        replaceAll: function (string, search, replace) {
            if ((string) && (search) && (replace)) {
                return string.split(search).join(replace)
            } else {
                throw Error("Não foi possivel alterar a string");
            }
        },
        validaRetorno: function (data, scope, rootScope, atributo) {
            if (data.fim_sessao) { 
                rootScope.usuario.logado = false;
            } else {
                if (data.status) {
                    if (this.validaString(atributo)) {
                        scope[atributo] = data.dados;
                    }
                    if (this.validaString(data.mensagem)) {
                        alertify.success(data.mensagem);
                    }
                    return true;
                } else {
                    if (data.mensagem !== undefined && data.mensagem != null) {
                        alertify.error(data.mensagem)
                    } else {
                        alertify.error(data)
                    }
                    console.log(data);
                }
            }
            return false;
        },
        clone: function (obj) {
            var copy;
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj)
                return obj;
            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr))
                        copy[attr] = this.clone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        },
        parseDecimal: function (valor) {
            if (valor === undefined || valor === "") {
                return 0;
            } else if (isNaN(valor) && valor.length > 0) {
                valor = valor.replace(",", ".");
            } else if (isNaN(valor)) {
                return 0;
            }
            var x = (parseFloat(valor)).toFixed(2);
            var num_valor = x.split(".");
            if (num_valor[1] !== undefined) {
                if (num_valor[1].length > 2) {
                    num_valor[1] = num_valor[1].substring(0, 2);
                }
                valor = num_valor[0] + "." + num_valor[1];
            }
            return parseFloat(valor);
        },
        convertDataNormal: function (data) {
            var valores = data.split("-");
            var data_f = valores[2] + "/" + valores[1] + "/" + valores[0];
            return data_f;
        },
        sleep: function (milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },
        updateAll: function (array, atributo, valor) {
            if (this.validaArray(array) && this.validaString(atributo)) {
                for (var x = 0 ; x < array.length; x++) {
                    array[x][atributo] = valor;
                }
            }
        }
    };
});