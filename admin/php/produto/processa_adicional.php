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
if (isset($_POST['nome'], $_POST['valor'])) {
    // Obtém os dados do adicional a partir dos campos enviados pelo formulário
    $nome = $_POST['nome'];
    $valor = $_POST['valor'];

    // Prepara a consulta SQL para inserir o adicional
    $sql = "INSERT INTO adicional (nome, valor) VALUES (?, ?)";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula os parâmetros da consulta
        $stmt->bind_param('sd', $nome, $valor); // 's' para string, 'd' para double

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
        echo "Erro ao preparar a consulta de inserção.";
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
                title: 'Adicional cadastrado com sucesso!',
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
                title: 'Erro ao cadastrar adicional',
                text: 'Por favor, tente novamente mais tarde.',
                showConfirmButton: true,
            }).then(function () {
                window.location.href = '../../painel.html';
            });
        });
    </script>
<?php endif; ?>
