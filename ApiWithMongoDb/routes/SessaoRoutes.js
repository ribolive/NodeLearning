var routes = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId; 
var Sessao = require('../models/Sessao');
var Boletim = require('../models/Boletim');

//POST adicionar novo Recorde
routes.post('/', async function(req, res){
    console.log("POST in SESSAO - /");
    if(!req.body.boletimId)
        return res.status(422).send({error: "Argumento invalidos"});
    else
    {
        let boletim = null;
        if(ObjectId.isValid(req.body.boletimId))
        {
            boletim = await Boletim.findById(req.body.boletimId).exec();
            if(!boletim) return res.status(403).send({error: "Não existe boletim com esse id"});
        }
        else 
            return res.status(403).send({error: "parametro boletim está invalido"});
    }
    let objIdBoletim = ObjectId(req.body.boletimId);

    objSessoes = await Boletim.find({ nome: req.body.nome, texto: req.body.texto, imagemSrc: req.body.imagemSrc, boletimId: objIdBoletim }).exec();
    if(objSessoes.length > 0)
        return res.send({info: "Sessão já cadastrada"}); 

    var novaSessao = new Sessao({
        nome: req.body.nome,
        texto: req.body.texto,
        imagemSrc: req.body.imagemSrc,
        boletimId: objIdBoletim
    });

    novaSessao.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Sessao: novaSessao}); // omitir status => 200 (sucesso)
    });
});

//Get all Recorde
routes.get('/', function(req, res){
    console.log("GET in SESSAO - /");
    Sessao.find().exec(function(err, sessoes){
        return res.send({sessoes}); 
    });
});


module.exports = routes;