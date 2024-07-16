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

// Verifique se o ID do produto foi enviado via POST
if (isset($_POST['id'])) {
    // Obtém o ID do produto a ser excluído
    $produtoId = $_POST['id'];

    // Prepara a consulta SQL para excluir o produto
    $sql = "DELETE FROM produto WHERE id = ?";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula o ID do produto como parâmetro na consulta
        $stmt->bind_param('i', $produtoId);

        // Executa a consulta
        if ($stmt->execute()) {
            // Verifica se algum registro foi afetado
            if ($stmt->affected_rows > 0) {
                // Retorna uma resposta de sucesso
                echo json_encode(["success" => true, "message" => "Produto excluído com sucesso."]);
            } else {
                // Se nenhum registro foi afetado, significa que o produto não foi encontrado
                echo json_encode(["success" => false, "message" => "Produto não encontrado."]);
            }
        } else {
            // Retorna uma resposta de erro caso a execução da consulta falhe
            echo json_encode(["success" => false, "message" => "Erro ao excluir o produto."]);
        }

        // Fecha a declaração
        $stmt->close();
    } else {
        // Retorna uma resposta de erro caso a preparação da consulta falhe
        echo json_encode(["success" => false, "message" => "Erro ao preparar a consulta de exclusão."]);
    }

    // Fecha a conexão com o banco de dados
    $conexao->close();
} else {
    // Retorna uma resposta de erro caso o ID do produto não tenha sido enviado
    echo json_encode(["success" => false, "message" => "ID do produto não fornecido."]);
}
?>
