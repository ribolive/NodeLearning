var routes = require('express').Router();
var Like = require('../models/Like');
var ObjectId = require('mongoose').Types.ObjectId; 
var Usuarios = require('../models/Usuario');
var Boletins = require('../models/Boletim');


//POST adicionar novo Comentario
routes.post('/', async function(req, res){
    console.log("POST in Like - /");
    if(!req.body.usuarioId || !req.body.boletimId){
        return res.status(422).send({error: "Argumentos invalidos"});
    }
    else 
    {
        let usuario = null;
        let boletim = null;

        if(ObjectId.isValid(req.body.usuarioId))
        {
            usuario = await Usuarios.findById(req.body.usuarioId).exec();
            if(!usuario) return res.status(403).send({error: "Não existe usuario com esse id"});     
        }
        else 
            return res.status(403).send({error: "usuario invalido"});

        if(ObjectId.isValid(req.body.boletimId))
        {
            boletim = await Boletins.findById(req.body.boletimId).exec();
            if(!usuario) return res.status(403).send({error: "Não existe boletim com esse id"});     
        }
        else 
            return res.status(403).send({error: "boletim invalido"});
    }
    let objIdUsuario = ObjectId(req.body.usuarioId);
    let objIdBoletim = ObjectId(req.body.boletimId);
    
    objLikes = await Like.find({usuarioId: objIdUsuario,
                                    boletimId: objIdBoletim}).exec();
    if(objLikes.length > 0)
        return res.send({info: "Usuario já curtiu esse boletim"});

    var novoLike = new Like({
        boletimId: objIdBoletim,
        usuarioId: objIdUsuario
    });
    novoLike.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Like: novoLike}); // omitir status => 200 (sucesso)
    });
});

// -------------------------------------------------------------
// GET's
// --------------------------------------------------------------

routes.get('/', function(req, res){
    console.log("\nGet em Like");

    if(req.query.boletimId && Object.keys(req.query).length == 1)
    {
        return RouteGetLikesPorBoletim(req, res)
    }
    else if(req.query.boletimId && req.query.usuarioId && Object.keys(req.query).length == 2)
    {
        return RouteGetLikesPorBoletimEUsuario(req, res)
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametros permitidos: \'boletimId\', \'usuarioId\'"});
    }

});

// Retorna todos likes de um boletim
function RouteGetLikesPorBoletim(req, res){
    console.log("Get like por boletim")

    var boletimId;
    if(typeof(req.query.boletimId) === 'string')
    {
        if(ObjectId.isValid(req.query.boletimId))
            boletimId = new ObjectId(req.query.boletimId);
        else return res.status(403).send({error: "BoletimId invalido"});
    }
    else return res.status(403).send({error: "informar apenas um boletim por vez"});

        
    Like.aggregate([
    {
        $match: {
            boletimId: boletimId
        }
    }]).exec(function(err, boletins){
        return res.send({boletins}); 
    });
}


// Retorna todos likes de um boletim
function RouteGetLikesPorBoletimEUsuario(req, res){
    console.log("Get like por boletim e usuario")

    var boletimId;
    var usuarioId;
    if(typeof(req.query.boletimId) === 'string' && typeof(req.query.usuarioId) === 'string')
    {
        if(ObjectId.isValid(req.query.boletimId))
            boletimId = new ObjectId(req.query.boletimId);
        else return res.status(403).send({error: "BoletimId invalido"});
        if(ObjectId.isValid(req.query.usuarioId))
            usuarioId = new ObjectId(req.query.usuarioId);
        else return res.status(403).send({error: "UsuarioId invalido"});
    }
    else return res.status(403).send({error: "Informar um boletimId e usuarioId Valido"});

        
    Like.aggregate([
    {
        $match: {
            boletimId: boletimId,
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
        return res.status(403).send({error: "Para dar dislike é necessario o id"});
    
    
    Like.findById(req.query.id, async function (err, like) {
        if(err) return res.status(403).send({error: err});

        boletim = await Boletins.findById(like.boletimId).exec();
        newlikeValue = boletim.likes - 1;
        Boletins.findByIdAndUpdate(like.boletimId, {likes: newlikeValue}).exec();

        like.remove(); //Removes the document
        //return res.send(like);
    })
});



module.exports = routes;