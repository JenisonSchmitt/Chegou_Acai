// check_login.js

function checkLoggedIn() {
    $.ajax({
        url: '../../php/cliente/check_login.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Resposta do servidor:', response);
            if (response.logged_in !== true) {
                console.log('Cliente não está logado. Redirecionando para login!');
                redirectToLogin();
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro na requisição AJAX:', error);
        }
    });
}

function redirectToLogin() {
    Swal.fire({
        icon: 'error',
        title: 'Login ainda não realizado!',
        html: '<span style="color: white;">Por favor, crie uma conta ou faça login para acessar o carrinho!</span>',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
            popup: 'bg-danger' // classe para o popup
        }
    }).then(function () {
        setTimeout(function() {
            window.location.href = '../login.html';
        }, 1500); // Atraso de 2000 milissegundos (2 segundos)
    });
}
