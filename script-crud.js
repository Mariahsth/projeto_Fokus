const botaoAddTarefa=document.querySelector(".app__button--add-task");
const formulario=document.querySelector(".app__form-add-task");
const textArea=document.querySelector(".app__form-textarea");
let tarefas=JSON.parse(localStorage.getItem("tarefas")) || [];
const ulTarefas=document.querySelector(".app__section-task-list");
const botaoCancelar=document.querySelector(".app__form-footer__button--cancel");
const paragrafoDescricaoTarefa=document.querySelector(".app__section-active-task-description");
const botaoRemoverConcluidas=document.getElementById("btn-remover-concluidas");
const botaoRemoverTodas=document.getElementById("btn-remover-todas");
let tarefaSelecionada=null;
let liTarefaSelecionada=null;

function atualizaTarefa() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

botaoCancelar.addEventListener("click", limparFormulario)

function limparFormulario() {
    textArea.value="";
    formulario.classList.add("hidden");
}

function criarElementoTarefa (tarefa) {
    const li=document.createElement("li");
    li.classList.add("app__section-task-list-item");
    const svg = document.createElement('svg');
    svg.innerHTML = 
    `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `
    const paragrafo=document.createElement("p");
    paragrafo.classList.add("app__section-task-list-item-description");
    paragrafo.textContent=tarefa.descricao;
    const botaoEditar=document.createElement("button");
    botaoEditar.classList.add("app_button-edit");
    const imagemBotaoEditar=document.createElement("img");
    imagemBotaoEditar.setAttribute("src", "/imagens/edit.png");
    botaoEditar.append(imagemBotaoEditar);
    li.append(svg);
    li.append(paragrafo);
    li.append(botaoEditar);

    botaoEditar.onclick =() => {
       const novaTarefa= prompt("Digite a nova tarefa:")
       if (novaTarefa) {
        paragrafo.textContent=novaTarefa;
        tarefa.descricao=novaTarefa;
        atualizaTarefa();
       }
    }

    if (tarefa.completa) {
        li.classList.add("app__section-task-list-item-complete");
        botaoEditar.setAttribute("disabled", "disabled");
    } else {
        li.onclick = () => {
            document.querySelectorAll(".app__section-task-list-item-active").forEach(elemento => {
                elemento.classList.remove("app__section-task-list-item-active")
            })
            if (tarefaSelecionada==tarefa) {
                li.classList.remove("app__section-task-list-item-active");
                paragrafoDescricaoTarefa.textContent='';
                tarefaSelecionada=null;
                liTarefaSelecionada=null;
                return
            }
                    
            tarefaSelecionada=tarefa;
            liTarefaSelecionada=li;
            li.classList.add("app__section-task-list-item-active");
            paragrafoDescricaoTarefa.textContent=tarefa.descricao;
        }

    }



    return li
}

botaoAddTarefa.addEventListener("click", ()=> {
    formulario.classList.toggle("hidden");
})

formulario.addEventListener("submit", (evento)=> {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    atualizaTarefa();
    const elementoTarefa=criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    limparFormulario()
})

tarefas.forEach(tarefa =>{
    const elementoTarefa=criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

document.addEventListener("FocoFinalizado", ()=>{
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
        liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
        liTarefaSelecionada.querySelector("button").setAttribute("disabled", "disabled");
        tarefaSelecionada.completa=true;
        atualizaTarefa();
    }
})

const removerTarefas= (tarefaConcluida) => {
    let seletor=".app__section-task-list-item";
    if (tarefaConcluida) {
        seletor=".app__section-task-list-item-complete"
    } 
    tarefas = tarefaConcluida? tarefas.filter(tarefa=>!tarefa.completa):[]
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
        atualizaTarefa()
    })
}

botaoRemoverConcluidas.onclick = () => removerTarefas(true);
botaoRemoverTodas.onclick = () => removerTarefas(false);



