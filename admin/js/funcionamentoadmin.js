var estadoManual = null;
var horariosFuncionamento = {};

// Função para verificar o horário de funcionamento no admin
function verificarHorarioFuncionamentoAdmin() {
    // Se não houver um estado manual definido, utilizar o estado do banco de dados
    if (estadoManual === null) {
        estadoManual = estaAberto; // Define o estado manual baseado no horário calculado
    }

    var statusBarbearia = document.getElementById('statusBarbearia');
    if (statusBarbearia) {
        statusBarbearia.className = 'statusBarbearia ' + (estadoManual ? 'aberto' : 'fechado');
        statusBarbearia.innerHTML = estadoManual ? '<p>Aberto</p>' : '<p>Fechado</p>';
    } else {
        console.error('Elemento statusBarbearia não encontrado.');
    }
}

// Função para alternar o estado manual no admin
function alternarEstadoManual() {
    estadoManual = !estadoManual;
    console.log('Alternando estado manual para:', estadoManual);

    // Atualiza o estado no servidor
    fetch('php/estado.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado_barbearia: estadoManual ? 'aberto' : 'fechado' })
    })
    .then(response => response.json())
    .then(data => {
        verificarHorarioFuncionamentoAdmin();
        // Atualiza o estado no cliente
        atualizarEstadoCliente(estadoManual);
    })
    .catch(error => {
        console.error('Erro ao alternar estado manual:', error); // Captura erros na requisição
    });
}

// Função para buscar o estado atual do servidor
function buscarEstadoAtual() {
    fetch('php/estado.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar estado atual: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Verifica se o retorno é um objeto não vazio antes de acessar suas propriedades
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error('Erro: resposta vazia do servidor.');
            }
            estadoManual = data.estado_barbearia === 'aberto'; // Converte para booleano (true/false)
            verificarHorarioFuncionamentoAdmin();
        })
        .catch(error => {
            console.error(error); // Captura e exibe o erro
            // Se ocorrer um erro na busca, talvez você queira definir um estado padrão ou tratar de outra forma
        });
}

// Função para atualizar o estado na tela do cliente
function atualizarEstadoCliente(estado) {
    fetch('php/atualizar_estado_cliente.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado_barbearia: estado ? 'aberto' : 'fechado' })
    });
}

// Função para converter hora no formato HH:MM para minutos desde o início do dia
function parseTimeToMinutes(time) {
    var parts = time.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

document.addEventListener('DOMContentLoaded', function() {
    buscarEstadoAtual();
    var statusBarbearia = document.getElementById('statusBarbearia');
    if (statusBarbearia) {
        console.log('Adicionando evento de clique ao statusBarbearia');
        statusBarbearia.addEventListener('click', alternarEstadoManual);
    } else {
        console.error('Elemento statusBarbearia não encontrado na inicialização.');
    }
});

setInterval(verificarHorarioFuncionamentoAdmin, 10000);
