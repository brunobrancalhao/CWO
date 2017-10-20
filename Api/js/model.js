var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var core_use = require('cors');
var sql = require("mssql");

app.use(core_use());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

var config = {
    server: '172.21.29.26',
    database: 'hackatonlaranja',
    user: 'cwo',
    password: 'zo42jl76',
    idleTimeoutMillis: 30000
};

var retorno = {
    method: '',
    uri: '',
    response: []
};

app.post('/consultarCartaoSus', function (req, res) {
    //var request = new testwe.Request();
    sql.connect(config, function (err) {
        var request = new sql.Request();
        console.log(req.query);
        console.log('select top 1 p.nome as NOME_PACIENTE, P.Cartao_SUS as CARTAO_SUS_PACIENTE from Pacientes P where (1=1) AND P.Cartao_SUS = \'' + req.query.cartaoSus + '\'');
        // query to the database and get the records ''
        request.query('select top 1 p.nome as NOME_PACIENTE, P.Cartao_SUS as CARTAO_SUS_PACIENTE from Pacientes P where (1=1) AND P.Cartao_SUS = \'' + req.query.cartaoSus + '\'', function (err, response) {
            if (err) {
                sql.close();
                console.log(err);
            };
            retorno.method = 'GET';
            retorno.uri = 'consultarCartaoSus';
            retorno.response = response.recordsets;

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(retorno);
            sql.close();
        });

    });

});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});