var mongoose = require("mongoose");
var Boletim = require('../models/Boletim');


var schemaLike = new mongoose.Schema({
    boletimId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    usuarioId:{
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

schemaLike.pre('save', async function(next){
    boletim = await Boletim.findById(this.boletimId).exec();
    if(boletim.likes){
        newlikeValue = boletim.likes + 1;
        Boletim.findByIdAndUpdate(this.boletimId, {likes: newlikeValue}).exec();
    }else{
        Boletim.findByIdAndUpdate(this.boletimId, {likes: 1}).exec();
    }
    next(null);
});


module.exports = mongoose.model('Like', schemaLike);
