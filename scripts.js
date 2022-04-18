
let nome;
let pastaMensagens = []  //Array que irá abrigar todas as mensagens da API
let todos = "todos"
let message = "message"

// Entrando na sala, pegando o nome do usuário
function pegarNome() {
     nome = document.querySelector(".caixa-nome").value
    
    
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
    let abrindoMensagens = document.querySelector(".container")
    let fechandoTelaDeEntrada = document.querySelector(".tela-de-entrada")
    abrindoMensagens.classList.add("ligando-display")
    fechandoTelaDeEntrada.classList.add("desligando-display")
}

function quandoErro(error) {
    if (error.response.status === 400) {
        alert("Um usuário com esse nome já está na sala. Por favor, digite um novo nome!");
        
      } else if (error.response.status === 200) {
        console.log("Tudo certo");
        
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

// Alimentando o body com as mensagens
function renderizandoMensagens() {
    let todasAsMensagens = document.querySelector(".conteudo-principal");
     todasAsMensagens.innerHTML = ""
     
     for (let i=0; i < pastaMensagens.length; i++) {
        // Primeiras mensagens
        if (pastaMensagens[i].type == "status") {
            todasAsMensagens.innerHTML += `<div class="entrar-na-sala">
            <h3> (${pastaMensagens[i].time}) &nbsp <strong>${pastaMensagens[i].from}</strong>&nbsp ${pastaMensagens[i].text} </h3>
     </div>
         `
        } else if (pastaMensagens[i].type == "message") {
            todasAsMensagens.innerHTML += `<div class="mensagem-todos">
            <h3> (${pastaMensagens[i].time}) &nbsp <strong>${pastaMensagens[i].from}</strong>&nbsp para &nbsp <strong>${pastaMensagens[i].to}</strong>: ${pastaMensagens[i].text} </h3>
         `
        }    
        else if ((pastaMensagens[i].type == "private_message") && ((pastaMensagens[i].to === nome) || (pastaMensagens[i].from === nome))) {
            todasAsMensagens.innerHTML += `<div class="mensagem-reservada">
            <h3> (${pastaMensagens[i].time}) &nbsp <strong>${pastaMensagens[i].from}</strong>&nbsp para &nbsp <strong>${pastaMensagens[i].to}</strong>: ${pastaMensagens[i].text} </h3>
     </div>
         `
        }   
    }



    scrollToBottom()
           
    
        
     
setTimeout(buscandomensagens, 3000)


}

function scrollToBottom() {
    let todasAsMensagens = document.querySelector(".conteudo-principal");
    todasAsMensagens.scrollIntoView(false);
  }

function erroMensagens() {
    console.log("As mensagens não foram carregadas")
}

//  Enviando uma mensagem para a API

function enviarMensagem() {
    console.log("O botão para enviar mensagem foi solicitado")
    const conteudo = document.querySelector(".mensagem").value
    console.log(conteudo)

    const novaMensagem = {
        from: nome,
        to: todos,
        text: conteudo,
        type: message
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);

    promise.then(sucessoEnvioMensagens);
    promise.catch(erroEnvioMensagens);

}

function sucessoEnvioMensagens() {
    console.log("A sua mensagem foi enviada PRA API")
   let mensagem = document.querySelector(".mensagem").value = ''
  
    
}
function erroEnvioMensagens() {
    console.log("A sua mensagem NÃO foi enviada API")
    window.location.reload()

}


document.addEventListener("keypress", function(clique) {
    if(clique.key == "Enter") {
        const btn = document.querySelector(".mensagem")
        enviarMensagem()
        
    } 
})


