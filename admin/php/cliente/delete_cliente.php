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

// Verifica se o ID do cliente foi recebido
if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Prepara a declaração SQL
    $stmt = $conn->prepare("DELETE FROM cliente WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Cliente excluído com sucesso!";
    } else {
        echo "Erro ao excluir cliente: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "ID do cliente não fornecido.";
}

$conn->close();
?>
