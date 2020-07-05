var routes = require('express').Router();
var Usuario = require('../models/Usuario');
var ObjectId = require('mongoose').Types.ObjectId; 


// --------------------------------------------------------------
// POST'S
// --------------------------------------------------------------

//POST adicionar novo Usuario
routes.post('/', function(req, res){
    console.log("POST in Usuario - /");
    if(!req.body.email){
        return res.status(422).send({error: "email é obrigatório"});
    }
    var novoUsuario = new Usuario({
        senha: req.body.senha,
        nome: req.body.nome,
        email: req.body.email,
        foto_url: req.body.foto_url
    });
    novoUsuario.save(function(err){
        if(err) return res.status(403).send({error: err});
        return res.send({Comentario: novoUsuario}); // omitir status => 200 (sucesso)
    });
});

// --------------------------------------------------------------
// GET'S
// --------------------------------------------------------------
routes.get('/', function(req, res){
    console.log("\nGet em Usuario");
    if(req.query.email && Object.keys(req.query).length == 1)
    {
        return RouteGetUsuarioPorEmail(req, res)
    }
    else
    {
        return res.status(403).send({error: "Parametros invalidos. Parametro permitido: \'email\'"});
    }
});

// Retorna O boletim com seus comentarios, sessoes e publicador
function RouteGetUsuarioPorEmail(req, res){

    var pEmail;
    console.log(typeof(req.query.email));
    if(typeof(req.query.email) === 'string')
    {
        pEmail = req.query.email;
    }
    else
    {
        return res.status(403).send({error: "Só é permitido a captura de um usuario por vez, passando o email"});
    }
    console.log("Email Usuario: " + pEmail);
    
    Usuario.aggregate([
    {
        $match: {
            email: pEmail
        }
    },{
        $lookup: {
            from: "seguidors",
            localField: "_id",
            foreignField: "usuarioId",
            as: "seguidores"
        }
    }]).sort({data: -1}).exec(function(err, usuarios){
        return res.send({usuarios}); 
    });
}

// --------------------------------------------------------------
// PUT'S
// --------------------------------------------------------------

//Put Atualiza um Usuario
routes.put('/', function(req, res){
    if(!req.query.id)
        return res.status(403).send({error: "Para alterar um usuario é necessario o id deste"});
    
    var usuario = {_id: req.query.id};
    if(req.body.nome)
        usuario["nome"] = req.body.nome;
    if(req.body.foto_url)
        usuario["foto_url"] = req.body.foto_url;
    if(req.body.foto_url)
        usuario["email"] = req.body.email;
    if(req.body.senha)
        usuario["senha"] = req.body.senha;

    //console.log(usuario);
    //console.log("-------------------------------------");

    Usuario.findByIdAndUpdate(req.query.id, usuario, (err, updatedBoard) => {
        console.log(updatedBoard)
        if (err) {
            res.json({
                usuario,
            success: false,
            msg: 'Falha ao atualizar um Usuario'
            })
        } else {
        res.json({usuario, success: true, msg: 'Usuario Atualizado'})
        }
    });
});

module.exports = routes;