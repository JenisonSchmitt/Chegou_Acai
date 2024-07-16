<?php
// Configurações do banco de dados
$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

// Conexão com o banco de dados usando MySQLi
$conexao = new mysqli($servername, $username, $password, $database);

// Verifica se há erros na conexão
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Verifica se os dados do adicional foram enviados via POST
if (isset($_POST['id']) && isset($_POST['nome']) && isset($_POST['valor'])) {
    // Obtém os dados do adicional a partir dos campos enviados pelo formulário
    $adicionalId = $_POST['id'];
    $nome = $_POST['nome'];
    $valor = $_POST['valor'];

    // Prepara a consulta SQL para atualizar o adicional
    $sql = "UPDATE adicional SET nome = ?, valor = ? WHERE id = ?";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula os dados do adicional como parâmetros na consulta
        $stmt->bind_param('sdi', $nome, $valor, $adicionalId);

        // Executa a consulta
        if ($stmt->execute()) {
            // Verifica se algum registro foi afetado
            if ($stmt->affected_rows > 0) {
                $redirectSuccess = true;
            } else {
                $redirectError = true;
            }
        } else {
            $redirectError = true;
        }

        // Fecha a declaração
        $stmt->close();
    } else {
        // Retorna uma resposta de erro caso a preparação da consulta falhe
        echo "Erro ao preparar a consulta de atualização.";
    }

    // Fecha a conexão com o banco de dados
    $conexao->close();
} else {
    // Retorna uma resposta de erro caso os dados do adicional não tenham sido enviados
    echo "Dados do adicional não fornecidos.";
}
?>

<?php if (isset($redirectSuccess) && $redirectSuccess): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'success',
                title: 'Adicional atualizado com sucesso!',
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
                title: 'Erro ao atualizar adicional',
                text: 'Por favor, tente novamente mais tarde.',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../painel.html';
            });
        });
    </script>
<?php endif; ?>
