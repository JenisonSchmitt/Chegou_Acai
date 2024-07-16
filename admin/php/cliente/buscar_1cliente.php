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

if (isset($_GET['id'])) {
    $clienteId = $_GET['id'];
    
    $sql = "SELECT * FROM cliente WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $clienteId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $cliente = $result->fetch_assoc();
        echo json_encode($cliente);
    } else {
        echo json_encode([]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode([]);
}
?>
