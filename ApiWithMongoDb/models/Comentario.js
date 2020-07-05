var mongoose = require("mongoose");

var schemaComentarios = new mongoose.Schema({
    usuarioId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    boletimId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    comentario:{
        type: String,
        required: true
    },
    data:{
        type: Date,
    }
});

schemaComentarios.pre('save', function(next){
    if(!this.data){
        this.data = Date.now();
        next(null);
    }
    next(null);
});

module.exports = mongoose.model('Comentario', schemaComentarios);
