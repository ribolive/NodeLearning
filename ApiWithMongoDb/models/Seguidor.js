var mongoose = require("mongoose");
var Usuarios = require('../models/Usuario');
var Publicadores = require('../models/Publicador');

var schemaSeguidor = new mongoose.Schema({
    publicadorId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    usuarioId:{
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

schemaSeguidor.pre('save', async function(next){
    publicador = await Publicadores.findById(this.publicadorId).exec();
    
    if(publicador.seguidorValue){
        seguidorValue = publicador.numSeguidores + 1;
        Publicadores.findByIdAndUpdate(this.publicadorId, {numSeguidores: seguidorValue}).exec();
    }else{
        Publicadores.findByIdAndUpdate(this.boletimId, {numSeguidores: 1}).exec();
    }
   
    next(null);
});

module.exports = mongoose.model('Seguidor', schemaSeguidor);
