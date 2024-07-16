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

// Verifica se o ID do adicional foi enviado via GET
if (isset($_GET['id'])) {
    // Obtém o ID do adicional
    $adicionalId = $_GET['id'];

    // Prepara a consulta SQL para buscar o adicional
    $sql = "SELECT id, nome, valor FROM adicional WHERE id = ?";

    // Inicia a conexão com o banco de dados e prepara a declaração
    if ($stmt = $conexao->prepare($sql)) {
        // Vincula o ID do adicional como parâmetro na consulta
        $stmt->bind_param('i', $adicionalId);

        // Executa a consulta
        if ($stmt->execute()) {
            // Obtém o resultado da consulta
            $result = $stmt->get_result();

            // Verifica se algum registro foi encontrado
            if ($result->num_rows > 0) {
                // Obtém os dados do adicional
                $adicional = $result->fetch_assoc();
                // Retorna os dados do adicional em formato JSON
                echo json_encode(["success" => true, "adicional" => $adicional]);
            } else {
                // Retorna uma resposta de erro caso o adicional não seja encontrado
                echo json_encode(["success" => false, "message" => "Adicional não encontrado."]);
            }
        } else {
            // Retorna uma resposta de erro caso a execução da consulta falhe
            echo json_encode(["success" => false, "message" => "Erro ao buscar o adicional: " . $stmt->error]);
        }

        // Fecha a declaração
        $stmt->close();
    } else {
        // Retorna uma resposta de erro caso a preparação da consulta falhe
        echo json_encode(["success" => false, "message" => "Erro ao preparar a consulta de busca: " . $conexao->error]);
    }

    // Fecha a conexão com o banco de dados
    $conexao->close();
} else {
    // Retorna uma resposta de erro caso o ID do adicional não tenha sido enviado
    echo json_encode(["success" => false, "message" => "ID do adicional não fornecido."]);
}
?>
