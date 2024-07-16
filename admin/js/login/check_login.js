function checkLoggedIn() {
    $.ajax({
        url: 'php/login/check_login.php',
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
        html: '<span style="color: white;">Por favor, faça login para acessar o Painel Administrativo!</span>',
        showConfirmButton: false,
        timer: 2500,
        customClass: {
            popup: 'bg-danger' // classe para o popup
        }
    }).then(function () {
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1500); // Atraso de 1500 milissegundos (1.5 segundos)
    });
}

$(document).ready(function() {
    checkLoggedIn();
});
