var mongoose = require("mongoose");

var schemaUsuario = new mongoose.Schema({
    senha:{
        type: String
    },
    foto_url:{
        type: String
    },
    nome:{
        type: String
    },
    email:{
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('Usuario', schemaUsuario);
