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

// Verifica se os dados do produto foram enviados via POST
if (isset($_POST['id']) && isset($_POST['nome']) && isset($_POST['desc1']) && isset($_POST['desc2']) && isset($_POST['valor']) && isset($_POST['adicional'])) {
    // Obtém os dados do produto a partir dos campos enviados pelo formulário
    $produtoId = $_POST['id'];
    $nome = $_POST['nome'];
    $desc1 = $_POST['desc1'];
    $desc2 = $_POST['desc2'];
    $valor = $_POST['valor'];
    $adicional = $_POST['adicional'];

    // Prepara a consulta SQL para atualizar o produto
    $sql = "UPDATE produto SET nome = ?, descricao1 = ?, descricao2 = ?, valor = ?, adicional = ? WHERE id = ?";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula os dados do produto como parâmetros na consulta
        $stmt->bind_param('ssssdi', $nome, $desc1, $desc2, $valor, $adicional, $produtoId);

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
    // Retorna uma resposta de erro caso os dados do produto não tenham sido enviados
    echo "Dados do produto não fornecidos.";
}
?>

<?php if (isset($redirectSuccess) && $redirectSuccess): ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            Swal.fire({
                icon: 'success',
                title: 'Produto atualizado com sucesso!',
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
                title: 'Erro ao atualizar produto',
                text: 'Por favor, tente novamente mais tarde.',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../painel.html';
            });
        });
    </script>
<?php endif; ?>
