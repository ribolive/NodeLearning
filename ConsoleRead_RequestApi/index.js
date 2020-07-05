const SERVER_URL = 'http://192.168.0.19:3000';

var axios = require("axios");
var term = require('terminal-kit').terminal;
var readlineSync = require('readline-sync');

// Se admin = [1, true] retorna senha do publicador
async function getPublicador(id, admin){
    params = "?id="+id+"&admin=" + admin;
    res = await axios.get(SERVER_URL + "/publicadors" + params)
        .then(function(response){
            return response 
            // console.log(response.data); // ex.: { user: 'Your User'}
            // console.log(response.status); // ex.: 200
        }); 
    if(res.status != 200)
        return {error: "erro" + res.status}
    else
        return res.data
}

async function main()
{

    console.log('\033c');
    term.red("---------------------------------------------------------------------\n");
    term.green("                           Publicadores APP                       \n");
    term.red("---------------------------------------------------------------------\n\n");
    
    var nomePublicador = readlineSync.question("Nome do publicador: ");
    console.log('Olá ' + nomePublicador + '!');
    var senhaPublicador = readlineSync.question("Informe sua Senha: ", {hideEchoBack: true});
    console.log('Oh, ' + nomePublicador + ' com a senha: ' + senhaPublicador + '!');
    
    opcoes = ['Listar seus boletins', 'Cadastrar um novo boletim'],
    index = readlineSync.keyInSelect(opcoes, 'Escolha uma opcao?');
    console.log(opcoes[index]);

    let publicador = await getPublicador("5ecdab7139336e1eb46ad029", 1);
    console.log("\n\npublicador:", publicador);
    process.exit();
}

main();