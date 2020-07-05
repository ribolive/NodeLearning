var mongoose = require("mongoose");

var schemaBoletim = new mongoose.Schema({
    imagemSrc:{
        type: String
    },
    titulo:{
        type: String
    },
    data:{
        type: Date
    },
    likes:{
        type: Number
    },
    publicadorId:{
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

schemaBoletim.pre('save', function(next){
    if(!this.data){
        this.data = Date.now();
        next(null);
    }
    next(null);
});

module.exports = mongoose.model('Boletim', schemaBoletim);
