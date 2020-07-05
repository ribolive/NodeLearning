var routes = require('express').Router();
var Publicador = require('../models/Publicador');
var ObjectId = require('mongoose').Types.ObjectId; 


//POST adicionar novo Comentario
routes.post('/', function(req, res){
    console.log("POST in Publicador - /");
    if(!req.body.nome){
        return res.status(422).send({error: "nome é obrigatório"});
    }
    var novoPublicador = new Publicador({
        fotoUrl: req.body.fotoUrl,
        numSeguidores: req.body.numSeguidores,
        nome: req.body.nome
    });
    novoPublicador.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Comentario: novoPublicador}); // omitir status => 200 (sucesso)
    });
});

// Controla as rotas de get na raiz
routes.get('/', function(req, res){
    console.log("\nGet em Comentarios")
    if(!Object.keys(req.query).length)
    {
        // Retorna todos os comentarios  existentes
        Publicador.find().exec(function(err, publicadores){
            return res.send({publicadores}); 
        });
    }
    else if(req.query.id && Object.keys(req.query).length == 1)
    {
        return RouteGetPublicadores(req, res)
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametros permitidos: \'id\' ou sem parametros (separadamente)"});
    }

});

// Retorna todos publicadores passados por parametro
function RouteGetPublicadores(req, res){
    
    var ids = [];
    if(typeof(req.query.id) === 'string')
    {
        if(ObjectId.isValid(req.query.id))
        {
            ids.push(new ObjectId(req.query.id));
        }
    }
    else
    {
        for(var i in req.query.id) 
        {
            if(ObjectId.isValid(req.query.id[i]))
            {
                ids.push(new ObjectId(req.query.id[i]));
            }
        }
    }
    console.log("PublicadorId\'s: " + ids);
    
    Publicador.aggregate([
    {
        $match: {
            _id: {$in: ids}
        }
    }]).exec(function(err, publicadors){
        return res.send({publicadors}); 
    });
}


module.exports = routes;