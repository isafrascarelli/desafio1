const input = document.getElementById('inputTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const lista = document.getElementById('lista');
const nomeUsuario = document.getElementById('nomeUsuario');

const btnTema = document.getElementById('tema');
const btnTodas = document.getElementById('todas');
const btnPendentes = document.getElementById('pendentes');
const btnConcluidas = document.getElementById('concluidas');


let nomeSalvo = localStorage.getItem('nome');

if (!nomeSalvo) {
    let nome = prompt('Digite seu nome:');

    while (!nome || nome.trim() === '') {
        nome = prompt('Nome inválido. Digite novamente:');
    }

    localStorage.setItem('nome', nome);
    nomeSalvo = nome;
}

nomeUsuario.textContent = `Olá, ${nomeSalvo} 👋`;

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let filtroAtual = 'todas';

function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}


function atualizarLista() {
    lista.innerHTML = '';

    let tarefasFiltradas = tarefas;

    if (filtroAtual === 'pendentes') {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    }

    if (filtroAtual === 'concluidas') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach((tarefa) => {

        const li = document.createElement('li');
        li.textContent = tarefa.texto;

        if (tarefa.concluida) {
            li.classList.add('concluida');
        }

        // marcar concluída
        li.addEventListener('click', () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas();
            atualizarLista();
        });

        const divAcoes = document.createElement('div');
        divAcoes.classList.add('acoes');

        const btnRemover = document.createElement('button');
        btnRemover.textContent = '🗑️';

        btnRemover.addEventListener('click', (e) => {
            e.stopPropagation(); 
            tarefas = tarefas.filter(t => t !== tarefa); 
            salvarTarefas();
            atualizarLista();
        });

        divAcoes.appendChild(btnRemover);
        li.appendChild(divAcoes);

        lista.appendChild(li);
    });
}

btnAdicionar.addEventListener('click', () => {
    const texto = input.value;

    if (texto.trim() !== '') {
        tarefas.push({
            texto: texto,
            concluida: false
        });

        salvarTarefas();
        atualizarLista();
        input.value = '';
    }
});

// filtro
btnTodas.addEventListener('click', () => {
    filtroAtual = 'todas';
    atualizarLista();
});

btnPendentes.addEventListener('click', () => {
    filtroAtual = 'pendentes';
    atualizarLista();
});

btnConcluidas.addEventListener('click', () => {
    filtroAtual = 'concluidas';
    atualizarLista();
});

const btnLimparTudo = document.getElementById('limparTudo');

btnLimparTudo.addEventListener('click', () => {
    const confirmar = confirm;
    if (confirmar) {
        localStorage.clear();
        location.reload(); 
    }
});

function atualizarTema(tema) {
    if (tema === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    localStorage.setItem('tema', tema);
}

const temaSalvo = localStorage.getItem('tema') || 'light';
atualizarTema(temaSalvo);

btnTema.addEventListener('click', () => {
    const temaAtual = document.body.classList.contains('dark') ? 'dark' : 'light';
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    atualizarTema(novoTema);
});

atualizarLista();