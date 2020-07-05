var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/UflaNewsApp"); // principal, criar teste

// app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//----------------------------------------------------------------------------------
// Alocação de rotas
//----------------------------------------------------------------------------------

var BoletimRoutes = require('./routes/BoletimRoutes');
var SassaoRoutes = require('./routes/SessaoRoutes');
var ComentarioRoutes = require('./routes/ComentarioRoutes');
var LikeRoutes = require('./routes/LikeRoutes');
var PublicadorRoutes = require('./routes/PublicadorRoutes');
var UsuarioRoutes = require('./routes/UsuarioRoutes');
var SeguidorRoutes = require('./routes/SeguidorRoutes');

app.use('/boletims', BoletimRoutes);
app.use('/sessaos', SassaoRoutes);
app.use('/comentarios', ComentarioRoutes);
app.use('/likes', LikeRoutes);
app.use('/publicadors', PublicadorRoutes);
app.use('/usuarios', UsuarioRoutes);
app.use('/seguidors', SeguidorRoutes);

//----------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------


app.listen(3000, function(){
    console.log("rodando - port: 3000")
});

module.exports = app;