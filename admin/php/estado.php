<?php
session_start();

header('Content-Type: application/json');

$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe o novo estado do POST
    $input = json_decode(file_get_contents('php://input'), true);
    $novo_estado = $input['estado_barbearia']; // Ajuste aqui para corresponder ao nome enviado do cliente

    // Atualiza o estado no banco de dados
    $sql_update = "UPDATE estado_funcionamento SET estado = '$novo_estado' WHERE id = 1";
    
    if ($conn->query($sql_update) === TRUE) {
        $_SESSION['estado_funcionamento'] = $novo_estado;
        echo json_encode(array('estado_atualizado' => true));
    } else {
        echo json_encode(array('estado_atualizado' => false, 'error' => $conn->error));
    }
} else {
    // Retorna o estado atual
    $sql_select = "SELECT estado FROM estado_funcionamento WHERE id = 1";
    $result = $conn->query($sql_select);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $estado_atual = $row['estado'];
    } else {
        $estado_atual = null;
    }

    echo json_encode(array('estado_barbearia' => $estado_atual));
}

$conn->close();
?>
