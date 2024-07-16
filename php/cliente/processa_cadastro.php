<?php
session_start();

$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

$nome = $_POST['nome'];
$telefone = $_POST['telefone'];
$email = $_POST['email'];
$senha = $_POST['senha'];
$endereco = $_POST['endereco'];
$numero = $_POST['numero'];
$complemento = $_POST['complemento'];
$bairro = $_POST['bairro'];
$cidade = $_POST['cidade'];
$cep = $_POST['cep'];

try {
    // Cria a conexão
    $conn = new mysqli($servername, $username, $password, $database);

    // Verifica a conexão
    if ($conn->connect_error) { 
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepara e executa a query para inserir os dados do cliente
    $sql = "INSERT INTO cliente (nome, telefone, email, endereco, numero, complemento, bairro, cidade, cep, senha) 
            VALUES ('$nome', '$telefone', '$email', '$endereco', '$numero', '$complemento', '$bairro', '$cidade', '$cep', '$senha')";

    $result = $conn->query($sql);

    // Verifica se a inserção foi bem-sucedida
    if ($result === TRUE) {
        // Inicia a sessão e armazena os dados do usuário
        $_SESSION['nome'] = $nome;
        $_SESSION['email'] = $email;
        // Adicione aqui outras informações que deseja armazenar na sessão

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
                title: 'Cadastro realizado com sucesso!',
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
                title: 'Erro ao criar usuário',
                text: 'E-mail já existente!',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../login.html';
            });
        });
    </script>
<?php endif; ?>
