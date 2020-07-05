var routes = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId; 
var Seguidores = require('../models/Seguidor');
var Usuarios = require('../models/Usuario');
var Publicadores = require('../models/Publicador');


//POST adicionar novo Seguidor
routes.post('/', async function(req, res){
    console.log("POST in Seguidor - /");
    if( !req.body.publicadorId || !req.body.usuarioId)
    {
        return res.status(422).send({error: "Argumentos invalidos"});
    } 
    else 
    {
        let publicador = null;
        let usuario = null;
        if(ObjectId.isValid(req.body.publicadorId))
        {
            publicador = await Publicadores.findById(req.body.publicadorId).exec();
            if(!publicador) return res.status(403).send({error: "Não existe publicador com esse id"});
        }
        else 
            return res.status(403).send({error: "publicador invalido"});
        

        if(ObjectId.isValid(req.body.usuarioId))
        {
            usuario = await Usuarios.findById(req.body.usuarioId).exec();
            if(!usuario) return res.status(403).send({error: "Não existe usuario com esse id"});     
        }
        else 
            return res.status(403).send({error: "usuario invalido"});
    }
    let objIdPublicador = ObjectId(req.body.publicadorId);
    let objIdUsuario = ObjectId(req.body.usuarioId);
    
    objSeguidores = await Seguidores.find({publicadorId: objIdPublicador, usuarioId: objIdUsuario}).exec();
    if(objSeguidores.length > 0)
        return res.send({info: "Usuario já segue este publicador"}); 

    var novoSeguidor = new Seguidores({
        publicadorId: objIdPublicador,
        usuarioId: objIdUsuario
    });
    console.log(novoSeguidor);
    novoSeguidor.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Seguidores: novoSeguidor}); // omitir status => 200 (sucesso)
    });
    //return res.status(200).send({Teste: "Chegou no fim do teste Carai"});;
});

// -------------------------------------------------------------
// GET's
// --------------------------------------------------------------

routes.get('/', function(req, res){
    console.log("\nGet em seguidor");

    if(req.query.publicadorId && Object.keys(req.query).length == 1)
    {
        return RouteGetLikesPorPublicador(req, res);
    }
    else if(req.query.publicadorId && req.query.usuarioId && Object.keys(req.query).length == 2)
    {
        return RouteGetLikesPorPublicadorEUsuario(req, res);
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametros permitidos: \'publicadorId\', \'usuarioId\'"});
    }

});

// Retorna todos seguidores de um publicador
function RouteGetLikesPorPublicador(req, res){
    console.log("Get seguidores por publicador")

    var publicadorId;
    if(typeof(req.query.publicadorId) === 'string')
    {
        if(ObjectId.isValid(req.query.publicadorId))
            publicadorId = new ObjectId(req.query.publicadorId);
        else return res.status(403).send({error: "publicadorId invalido"});
    }
    else return res.status(403).send({error: "informar apenas um publicador por vez"});

        
    Seguidores.aggregate([
    {
        $match: {
            publicadorId: publicadorId
        }
    }]).exec(function(err, seguidores){
        return res.send({seguidores}); 
    });
}

// Retorna um seguidor de um publicador
function RouteGetLikesPorPublicadorEUsuario(req, res){
    console.log("Get seguidor de um publicador")

    var publicadorId;
    var usuarioId;
    if(typeof(req.query.publicadorId) === 'string' && typeof(req.query.usuarioId) === 'string')
    {
        if(ObjectId.isValid(req.query.publicadorId))
            publicadorId = new ObjectId(req.query.publicadorId);
        else return res.status(403).send({error: "publicadorId invalido"});
        if(ObjectId.isValid(req.query.usuarioId))
            usuarioId = new ObjectId(req.query.usuarioId);
        else return res.status(403).send({error: "UsuarioId invalido"});
    }
    else return res.status(403).send({error: "Informar um publicadorId e usuarioId Valido"});

        
    Seguidores.aggregate([
    {
        $match: {
            publicadorId: publicadorId,
            usuarioId: usuarioId
        }
    }]).exec(function(err, boletins){
        return res.send({boletins}); 
    });
}

// --------------------------------------------------------------
// Delete
// --------------------------------------------------------------

routes.delete('/', async function(req, res){
    console.log("Delete like")
    if(!req.query.id)
        return res.status(403).send({error: "Para parar de seguir é necessario o id"});
    
    
    Seguidores.findById(req.query.id, async function (err, seguidor) {
        if(err) return res.status(403).send({error: err});

        publicador = await Publicadores.findById(seguidor.publicadorId).exec();
        newlikeValue = publicador.numSeguidores - 1;
        Publicadores.findByIdAndUpdate(seguidor.publicadorId, {numSeguidores: newlikeValue}).exec();

        seguidor.remove(); //Removes the document
        return res.send(seguidor);
    })
});
module.exports = routes;