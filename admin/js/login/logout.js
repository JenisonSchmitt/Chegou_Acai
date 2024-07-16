document.addEventListener('DOMContentLoaded', function() {
    fetch('php/login/logout.php', {
        method: 'POST', // ou 'GET', dependendo do método que deseja usar
        credentials: 'same-origin' // Garante que os cookies da sessão sejam enviados
    })
    .then(response => {
        if (response.ok) {
            console.log('Sessão encerrada com sucesso.');
        } else {
            console.error('Erro ao encerrar sessão.');
        }
    })
    .catch(error => {
        console.error('Erro ao encerrar sessão:', error);
    });
});