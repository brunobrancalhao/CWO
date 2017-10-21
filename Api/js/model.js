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
        request.query('select top 1 p.nome as NOME_PACIENTE, P.Cartao_SUS as cartaoSus from Pacientes P where (1=1) AND P.Cartao_SUS = \'' + req.query.cartaoSus + '\'', function (err, response) {
            if (err) {
                sql.close();
                console.log(err);
            };
            retorno.method = 'POST';
            retorno.uri = 'consultarCartaoSus';
            retorno.response = response.recordsets;

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(retorno);
            sql.close();
        });

    });

});

app.get('/consultarAPAC', function (req, res) {
    //var request = new testwe.Request();
    sql.connect(config, function (err) {
        var request = new sql.Request();
        // query to the database and get the records ''
        request.query('SELECT  AU.Descricao AS DescricaoProcedimento, AP.Chave as controle,'+
         'AP.Data_Cons as DataConsulta,       P.Nome,      Usoli.Hosp_Descricao   AS UnidadeSolicitante,       MSoli.Nome             AS MedicoSolicitante,'+
      'ASI.Desc_Situ as SituacaoAPAC,       Upres.Hosp_Descricao   AS UnidadePrestadora,       MAuto.Nome             AS MedicoAutorizador, '+
       'AP.Data_Inicial,       Ap.Data_Final,       AC.Descricao           AS TipoMedico,  AP.Data_Ocor as DataOcorrencia, '+
          'AP.Data_Realiz as DataRealizacao '+
        'FROM   Cad_APACS AP '+
       'INNER JOIN Pacientes P                                   ON ( P.Matricula = AP.Matricula ) '+
       'INNER JOIN Aux_hospital USoli               ON ( USoli.Hosp_ID = AP.Unid_Soli ) '+
       'INNER JOIN Aux_hospital UPres               ON ( UPres.Hosp_ID = AP.Unid_Pres ) '+
       'INNER JOIN Medicos MSoli                    ON ( MSoli.Codigo = AP.Medi_Soli ) '+
       'INNER JOIN Medicos MAuto               ON ( MAuto.Codigo = AP.Medi_Auto ) '+
       'LEFT JOIN Aux_Situacao ASI              ON ( ASI.Codi_Situ = Ap.Codi_Situ ) '+
       'LEFT JOIN aux_cbo AC              ON ( AC.Codigo_CBO collate SQL_Latin1_General_CP1_CI_AS = AP.Codigo_CBO collate SQL_Latin1_General_CP1_CI_AS ) '+
       'LEFT JOIN Aux_TipoApac AT              ON ( AT.Codigo = Ap.Tipo_APAC AND AT.Mes = Ap.Mes_Continuidade ) '+
       'LEFT JOIN Apacs_procedimentos APROC              ON ( APROC.Chave = AP.Chave ) '+
       'LEFT JOIN Aux_Procedimento AU              ON ( AU.cod_procedimento collate SQL_Latin1_General_CP1_CI_AS = APROC.cod_Procedimento collate SQL_Latin1_General_CP1_CI_AS ) '+
        'left join aux_modalidadeapac ama on (ama.codigomodalidade = ap.codigomodalidade) '+
      'WHERE  p.cartao_sus  = \'' + req.query.cartaoSus + '\' and AP.chave = \'' + req.query.chave + '\'', function (err, response) {
            if (err) {
                sql.close();
                console.log(err);
            };
            retorno.method = 'GET';
            retorno.uri = 'consultarAPAC';
            retorno.response = response.recordsets;

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(retorno);
            sql.close();
        });
    });

});

app.get('/ApacEstadoAtual', function (req, res) {
    //var request = new testwe.Request();
    sql.connect(config, function (err) {
        var request = new sql.Request();
        // query to the database and get the records ''
        request.query('SELECT  distinct AU.Descricao AS DescricaoProcedimento, AP.Chave as controle,'+
         'AP.Data_Cons as DataConsulta,       P.Nome, '+
      'ASI.Desc_Situ as SituacaoAPAC, MAuto.Nome             AS MedicoAutorizador, Upres.Hosp_Descricao   AS UnidadePrestadora,  u.cep as CEP '+
      'FROM   Cad_APACS AP '+
       'INNER JOIN Pacientes P                                   ON ( P.Matricula = AP.Matricula ) '+
       'INNER JOIN Aux_hospital USoli               ON ( USoli.Hosp_ID = AP.Unid_Soli ) '+
       'INNER JOIN Aux_hospital UPres               ON ( UPres.Hosp_ID = AP.Unid_Pres ) '+
       'INNER JOIN Medicos MSoli                    ON ( MSoli.Codigo = AP.Medi_Soli ) '+
       'INNER JOIN Medicos MAuto               ON ( MAuto.Codigo = AP.Medi_Auto ) '+
       'LEFT JOIN Aux_Situacao ASI              ON ( ASI.Codi_Situ = Ap.Codi_Situ ) '+
       'LEFT JOIN aux_cbo AC              ON ( AC.Codigo_CBO collate SQL_Latin1_General_CP1_CI_AS = AP.Codigo_CBO collate SQL_Latin1_General_CP1_CI_AS ) '+
       'LEFT JOIN Aux_TipoApac AT              ON ( AT.Codigo = Ap.Tipo_APAC AND AT.Mes = Ap.Mes_Continuidade ) '+
       'LEFT JOIN Apacs_procedimentos APROC              ON ( APROC.Chave = AP.Chave ) '+
       'LEFT JOIN Aux_Procedimento AU              ON ( AU.cod_procedimento collate SQL_Latin1_General_CP1_CI_AS = APROC.cod_Procedimento collate SQL_Latin1_General_CP1_CI_AS ) '+
        'left join aux_modalidadeapac ama on (ama.codigomodalidade = ap.codigomodalidade) '+
        'inner join unidades u on u.Codigo_CNES = UPRES.Codigo_CNES '+
      'WHERE  p.cartao_sus  = \'' + req.query.cartaoSus + '\'', function (err, response) {
            if (err) {
                sql.close();
                console.log(err);
            };
            retorno.method = 'GET';
            retorno.uri = 'ApacEstadoAtual';
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