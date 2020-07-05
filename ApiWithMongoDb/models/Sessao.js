var mongoose = require("mongoose");

var schemaSessao = new mongoose.Schema({
    texto:{
        type: String,
    },
    imagemSrc:{
        type: String
    },
    boletimId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    nome:{
        type: String
    }
});


module.exports = mongoose.model('Sessao', schemaSessao);
