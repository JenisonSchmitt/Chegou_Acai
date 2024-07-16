function checkLoggedIn() {
    $.ajax({
        url: '../../php/cliente/check_login.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Resposta do servidor:', response);
            if (response.logged_in === true) {
                console.log('Cliente está logado!');
            } else {
                console.log('Cliente não está logado. Redirecionando para login!');
                Swal.fire({
                    icon: 'error',
                    title: 'Login ainda não realizado!',
                    html: '<span style="color: white;">Por favor, crie uma conta ou faça login para acessar o carrinho!</span>',
                    showConfirmButton: false,
                    timer: 2500,
                    customClass: {
                        popup: 'bg-danger' // classe para o popup
                    }
                }).then(function () {
                    window.location.href = '../login.html';
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro na requisição AJAX:', error);
        }
    });
}

$(document).ready(function() {
    console.log('Página carregada. Verificando se o cliente está logado...');
    checkLoggedIn();
});
