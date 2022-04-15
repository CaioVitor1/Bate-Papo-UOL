
let nome;
let pastaMensagens = []  //Array que irá abrigar todas as mensagens da API

// Entrando na sala, pegando o nome do usuário
function pegarNome() {
     nome = prompt("Olá, bem-vindo ao nosso bate-papo. Qual seu nome?")
    
    let bemVindo = {
        name: nome
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", bemVindo)

    promise.then(quandoSucesso);
    promise.catch(quandoErro);

    //Mantendo o usuário online
    mantendoConexao();
    buscandomensagens();
}

function quandoSucesso() {
    console.log("Deu certo")
}

function quandoErro(erro) {
    if (error.response.status === 409) {
        alert("Um usuário com esse nome já está na sala. Por favor, digite um novo nome!");
        pegarNome()
      } 

    console.log("Status novo code: " + erro.response.status); 
	console.log("Mensagem de erro: " + erro.response.data);
}

function mantendoConexao() {
    idInterval = setInterval(conexao, 5000);
}

function conexao() {
    let enviandoNome = {
        name: nome
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", enviandoNome);

    promise.then(quandoSucessoConexao);
    promise.catch(quandoErroConexao);
}

function quandoSucessoConexao() {
    console.log("Estamos mantendo você conectado")
}
function quandoErroConexao() {
    console.log("Não estamos mantendo você conectado")
}

// Buscando mensagens da API
function buscandomensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(carregandoMensagens);
    promise.catch(erroMensagens)
}

function carregandoMensagens(mensagens) {
    console.log("As mensagens foram carregadas")
    pastaMensagens = mensagens.data 
    console.log("A quantidade de mensagens é: " + pastaMensagens.length)
    renderizandoMensagens();
}

function renderizandoMensagens() {
    let todasAsMensagens = document.querySelector(".conteudo-principal");
     todasAsMensagens.innerHTML = ""
     for (let i=0; i < pastaMensagens.length; i++) {
        if (pastaMensagens[i].type == "status") {
            todasAsMensagens.innerHTML += `<div class="entrar-na-sala">
           <h3> (${pastaMensagens[i].time}) ${pastaMensagens[i].from}  ${pastaMensagens[i].text} </h3>
     </div>
         `
        } else if (pastaMensagens[i].type == "message") {
            todasAsMensagens.innerHTML += `<div class="mensagem-todos">
            <h3> (${pastaMensagens[i].time}) ${pastaMensagens[i].from}  ${pastaMensagens[i].text} </h3>
     </div>
         `
        }    
        else if (pastaMensagens[i].type == "private_message") {
            todasAsMensagens.innerHTML += `<div class="mensagem-reservada">
            <h3> (${pastaMensagens[i].time}) ${pastaMensagens[i].from}  ${pastaMensagens[i].text} </h3>
     </div>
         `
        }   
         

     }   


}



function erroMensagens() {
    console.log("As mensagens não foram carregadas")
}






pegarNome()
