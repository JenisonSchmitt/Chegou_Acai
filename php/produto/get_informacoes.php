<?php
$servername = "localhost";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";
$dbname = "u228502032_chegouacai";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, nome, descricao1, descricao2, valor, adicional FROM produto";
$result = $conn->query($sql);

$produto = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $produto[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($produto);
?>
