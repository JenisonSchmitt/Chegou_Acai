<?php
session_start();

$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

$telefone = $_POST['telefone'];
$email = $_POST['email'];
$senha = $_POST['senha'];

try {
    // Cria a conexão
    $conn = new mysqli($servername, $username, $password, $database);

    // Verifica a conexão
    if ($conn->connect_error) { 
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepara e executa a query para inserir os dados do cliente
    $sql = "UPDATE cliente SET senha='$senha' WHERE email='$email' AND telefone='$telefone'";

    $result = $conn->query($sql);

    // Verifica se a alteração foi bem-sucedida
    if ($result && $conn->affected_rows > 0) {
        // Inicia a sessão e armazena os dados do usuário
        $_SESSION['nome'] = $nome;
        $_SESSION['email'] = $email;

        $redirectSuccess = true;
    } else {
        $redirectError = true;
    }

    // Fecha a conexão
    $conn->close();
} catch (Exception $e) {
    $redirectError = true;
}
?>

<?php if (isset($redirectSuccess) && $redirectSuccess): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'success',
                title: 'Senha atualizada com sucesso!',
                text: 'Você será direcionado para o carrinho!',
                showConfirmButton: false,
                timer: 2500
            }).then(function () {
                window.location.href = '../../carrinho.html';
            });
        });
    </script>
<?php elseif (isset($redirectError) && $redirectError): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar usuário',
                text: 'Verifique os dados e tente novamente!',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../redsenha.html';
            });
        });
    </script>
<?php endif; ?>
    