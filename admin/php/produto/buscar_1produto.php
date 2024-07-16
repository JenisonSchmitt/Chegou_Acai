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

// Verifica se o ID do produto foi enviado via GET
if (isset($_GET['id'])) {
    // Obtém o ID do produto
    $produtoId = $_GET['id'];

    // Prepara a consulta SQL para buscar o produto
    $sql = "SELECT * FROM produto WHERE id = ?";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula o ID do produto como parâmetro na consulta
        $stmt->bind_param('i', $produtoId);

        // Executa a consulta
        $stmt->execute();

        // Obtém o resultado da consulta
        $result = $stmt->get_result();

        // Verifica se o produto foi encontrado
        if ($result->num_rows > 0) {
            // Obtém os dados do produto
            $produto = $result->fetch_assoc();

            // Retorna os dados do produto como JSON
            echo json_encode($produto);
        } else {
            // Se o produto não for encontrado, retorna uma resposta de erro
            echo json_encode(null);
        }

        // Fecha a declaração
        $stmt->close();
    } else {
        // Retorna uma resposta de erro caso a preparação da consulta falhe
        echo json_encode(null);
    }

    // Fecha a conexão com o banco de dados
    $conexao->close();
} else {
    // Retorna uma resposta de erro caso o ID do produto não tenha sido enviado
    echo json_encode(null);
}
?>
