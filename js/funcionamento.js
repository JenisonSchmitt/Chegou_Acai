// funcionamento.js

// Função para verificar o horário de funcionamento
function verificarHorarioFuncionamento() {
    var agora = new Date();
    var estaAberto = (agora.getDay() !== 1) && (agora.getHours() >= 8 && (agora.getHours() < 20 || (agora.getHours() === 0 && agora.getMinutes() === 0)));

    // Busca o estado atual da barbearia do servidor
    fetch('admin/php/estado.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Se houver um estado manual, ele prevalece
            if (data.estado_barbearia !== null) {
                estaAberto = data.estado_barbearia === 'aberto';
            }

            var statusBarbearia = document.getElementById('statusBarbearia');
            if (statusBarbearia) {
                statusBarbearia.className = 'statusBarbearia ' + (estaAberto ? 'aberto' : 'fechado');
                statusBarbearia.innerHTML = estaAberto ? '<p>Aberto</p>' : '<p>Fechado</p>';
            } else {
                console.error('Elemento statusBarbearia não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar estado:', error); // Captura erros na busca do estado
        });
}

// Atualiza o estado automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    verificarHorarioFuncionamento();
    setInterval(verificarHorarioFuncionamento, 1000); // Intervalo de 1 segundos para verificar o estado
});
