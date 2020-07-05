var routes = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId; 
var Comentario = require('../models/Comentario');
var Usuarios = require('../models/Usuario');
var Boletins = require('../models/Boletim');

// --------------------------------------------------------------
// POST'S
// --------------------------------------------------------------

//POST adicionar novo Comentario
routes.post('/', async function(req, res){
    console.log("POST in Comentario - /");
    if(!req.body.usuarioId || !req.body.boletimId || !req.body.comentario){
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
    
    objComentarios = await Comentario.find({usuarioId: req.body.usuarioId,
                                            boletimId: req.body.boletimId,
                                            comentario: req.body.comentario}).exec();
    if(objComentarios.length > 0)
        return res.send({info: "Comentário duplicado"}); 


    var novoComentario = new Comentario({
        usuarioId: objIdUsuario,
        boletimId: objIdBoletim,
        comentario: req.body.comentario
    });
    novoComentario.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Comentario: novoComentario}); // omitir status => 200 (sucesso)
    });
});

// --------------------------------------------------------------
// Get'S
// --------------------------------------------------------------

// Controla as rotas de get na raiz
routes.get('/', function(req, res){
    console.log("\nGet em Comentarios")
    if(!Object.keys(req.query).length)
    {
        // Retorna todos os comentarios  existentes
        Comentario.find().exec(function(err, comentarios){
            return res.send({comentarios}); 
        });
    }
    else if(req.query.boletimId && Object.keys(req.query).length == 1)
    {
        return RouteGetComentariosPorBoletim(req, res)
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametros permitidos: \'boletimId\' ou sem parametros (separadamente)"});
    }

});

// Retorna todos boletins, com suas sessoes, dos publicadores requisitados
function RouteGetComentariosPorBoletim(req, res){
    
    var boletimId;
    if(typeof(req.query.boletimId) === 'string')
    {
        if(ObjectId.isValid(req.query.boletimId))
        {
            boletimId = new ObjectId(req.query.boletimId);
        }
    }
    else
    {
        return res.status(403).send({error: "Só é permitido a captura de um boletim por vez, passando o Id"});
    }
    console.log("BoletimId: " + boletimId);
    
    Comentario.aggregate([
    {
        $match: {
            boletimId: boletimId
        }
    },{
        $lookup: {
            from: "usuarios",
            localField: "usuarioId",
            foreignField: "_id",
            as: "usuario"
        }
    }]).sort({data: -1}).exec(function(err, comentarios){
        return res.send({comentarios}); 
    });
}


// --------------------------------------------------------------
// Delete
// --------------------------------------------------------------

routes.delete('/', function(req, res){
    if(!req.query.id)
        return res.status(403).send({error: "Para deletar o comentario é necessario o id do usuario"});

    Comentario.findByIdAndDelete(req.query.id, function (comentario, err){
        if(err) return res.status(403).send({error: err});
        return res.send({comentario});
    });
});

module.exports = routes;