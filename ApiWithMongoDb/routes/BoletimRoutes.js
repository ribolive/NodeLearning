var routes = require('express').Router();
var Boletim = require('../models/Boletim');
var Publicadores = require('../models/Publicador');
var Sessoes = require('../models/Sessao');
var ObjectId = require('mongoose').Types.ObjectId; 

//POST adicionar novo boletim
routes.post('/', async function(req, res){
    console.log("POST in BOLETIM - /");
    if(!req.body.publicadorId)
        return res.status(422).send({error: "Argumento invalidos"});
    else
    {
        let publicador = null;
        if(ObjectId.isValid(req.body.publicadorId))
        {
            publicador = await Publicadores.findById(req.body.publicadorId).exec();
            if(!publicador) return res.status(403).send({error: "Não existe publicador com esse id"});
        }
    }
    let objIdPublicador = ObjectId(req.body.publicadorId);

    objBoletins = await Boletim.find({imagemSrc: req.body.imagemSrc, titulo: req.body.titulo, publicadorId: objIdPublicador}).exec();
    if(objBoletins.length > 0)
        return res.send({info: "Já existe um boletim com essas informações"}); 
 
    var novoBoletim = new Boletim({
        imagemSrc: req.body.imagemSrc,
        titulo: req.body.titulo,
        publicadorId: objIdPublicador
    });
    novoBoletim.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Boletim: novoBoletim}); // omitir status => 200 (sucesso)
    });
});

routes.get('/', function(req, res){
    console.log("\nGet em Boletim");
    if(!Object.keys(req.query).length)
    {
        // Retorna todos os boletins existentes
        Boletim.find().exec(function(err, boletims){
            return res.send({boletims}); 
        });
    }
    else if(req.query.publicadorId && Object.keys(req.query).length == 1)
    {
        return RouteGetBoletimPorPublicador(req, res)
    }
    else if(req.query.id && Object.keys(req.query).length == 1)
    {
        return RouteGetBoletimPorId(req, res)
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametros permitidos: \'publicadorId\', \'id\' ou sem parametros (separadamente)"});
    }

});

// Retorna todos boletins, com suas sessoes, dos publicadores requisitados
function RouteGetBoletimPorPublicador(req, res){
    
    var publicadores = [];
    if(typeof(req.query.publicadorId) === 'string')
    {
        if(ObjectId.isValid(req.query.publicadorId))
        {
            publicadores.push(new ObjectId(req.query.publicadorId));
        }
    }
    else
    {
        for(var i in req.query.publicadorId) 
        {
            if(ObjectId.isValid(req.query.publicadorId[i]))
            {
                publicadores.push(new ObjectId(req.query.publicadorId[i]));
            }
        }
    }
    console.log("publicadoes: " + publicadores);
    
    Boletim.aggregate([
    {
        $match: {
            publicadorId: { $in: publicadores}
        }
    },{
        $lookup: {
            from: "sessaos",
            localField: "_id",
            foreignField: "boletimId",
            as: "sessoes"
        }
    },{
        $lookup: {
            from: "publicadors",
            localField: "publicadorId",
            foreignField: "_id",
            as: "publicador"
        }
    }]).sort({data: -1}).exec(function(err, boletins){
        return res.send({boletins}); 
    });
}

// Retorna O boletim com seus comentarios, sessoes e publicador
function RouteGetBoletimPorId(req, res){

    var boletimId;
    if(typeof(req.query.id) === 'string')
    {
        if(ObjectId.isValid(req.query.id))
        {
            boletimId = new ObjectId(req.query.id);
        }
    }
    else
    {
        return res.status(403).send({error: "Só é permitido a captura de um boletim por vez, passando o Id"});
    }
    console.log("Boletim Id: " + boletimId);
    
    Boletim.aggregate([
    {
        $match: {
            _id: boletimId
        }
    },{
        $lookup: {
            from: "sessaos",
            localField: "_id",
            foreignField: "boletimId",
            as: "sessoes"
        }
    },{
        $lookup: {
        from: "comentarios",
        localField: "_id",
        foreignField: "boletimId",
        as: "comentarios"
        }
    },{
        $lookup: {
            from: "publicadors",
            localField: "publicadorId",
            foreignField: "_id",
            as: "publicador"
        }
    }]).sort({data: -1}).exec(function(err, boletins){
        return res.send({boletins}); 
    });
}

module.exports = routes;