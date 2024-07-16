<?php
// Configurações do banco de dados
$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

// Criação da conexão
$conn = new mysqli($servername, $username, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clienteId = $_POST['id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $endereco = $_POST['endereco'];
    $numero = $_POST['numero'];
    $complemento = $_POST['complemento'];
    $bairro = $_POST['bairro'];
    $cidade = $_POST['cidade'];
    $cep = $_POST['cep'];

    // SQL para o UPDATE
    $sql = "UPDATE cliente SET nome = ?, email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, cep = ? WHERE id = ?";
    
    // Prepara a declaração SQL
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssi", $nome, $email, $telefone, $endereco, $numero, $complemento, $bairro, $cidade, $cep, $clienteId);

    // Executa a declaração SQL
    if ($stmt->execute()) {
        // Se a atualização for bem-sucedida, retorna uma mensagem de sucesso
        $redirectSuccess = true;
    } else {
        // Se houver um erro, retorna uma mensagem de erro
        $redirectError = true;
    }

    $stmt->close();
    $conn->close();
}
?>

<?php if (isset($redirectSuccess) && $redirectSuccess): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'success',
                title: 'Dados atualizados com sucesso!',
                text: 'Redirecionando...',
                showConfirmButton: false,
                timer: 2500
            }).then(function () {
                window.location.href = '../../painel.html';
            });
        });
    </script>
<?php elseif (isset($redirectError) && $redirectError): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar dados',
                text: 'Por favor, tente novamente mais tarde.',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../painel.html';
            });
        });
    </script>
<?php endif; ?>
