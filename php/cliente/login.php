<?php
session_start();

// Verifica se o formulário de login foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Configurações de conexão com o banco de dados
    $servername = "localhost";
    $database = "u228502032_chegouacai";
    $username = "u228502032_chegouacai";
    $password = "#ChegouAcai1342";

    // Conexão com o banco de dados
    $conn = new mysqli($servername, $username, $password, $database);

    // Verifica se a conexão foi estabelecida corretamente
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Recupera os dados do formulário
    $email = $_POST['email'];
    $senha = $_POST['password'];

    // Consulta SQL para verificar se o usuário existe e as credenciais estão corretas
    $sql = "SELECT * FROM cliente WHERE email = '$email' AND senha = '$senha'";
    $result = $conn->query($sql);

    // Verifica se há resultados
    if ($result->num_rows > 0) {
        // Autenticação bem-sucedida, armazena o email do usuário na session
        $_SESSION['email'] = $email;
        // Define a variável de redirecionamento de sucesso
        $redirectSuccess = true;
    } else {
        // Erro de autenticação, define a variável de redirecionamento de erro
        $redirectError = true;
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
} else {
    // Se o formulário não foi submetido via POST, redireciona de volta para a página de login
    header("Location: login.html");
    exit();
}
?>

<?php if (isset($redirectSuccess) && $redirectSuccess): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                showConfirmButton: false,
                timer: 1500
            }).then(function () {
                window.location.href = '../../carrinho.html#carrinho';
            });
        });
    </script>
<?php elseif (isset($redirectError) && $redirectError): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'error',
                title: 'Erro de autenticação',
                text: 'Senha ou e-mail incorretos!',
                showConfirmButton: true,
                timer: 1500
            }).then(function () {
                window.location.href = '../../login.html';
            });
        });
    </script>
<?php endif; ?>
