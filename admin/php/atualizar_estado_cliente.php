<?php
session_start();

header('Content-Type: application/json');

$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe o novo estado
    $input = json_decode(file_get_contents('php://input'), true);
    $novo_estado = $input['estado_funcionamento'];

    // Atualiza o estado no banco de dados
    $sql_update = "UPDATE estado_funcionamento SET estado = '$novo_estado' WHERE id = 1";
    
    if ($conn->query($sql_update) === TRUE) {
        echo json_encode(array('estado_atualizado' => true));
    } else {
        echo json_encode(array('estado_atualizado' => false, 'error' => $conn->error));
    }
}

$conn->close();
?>
