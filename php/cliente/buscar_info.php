<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'Usuário não autenticado']);
    exit();
}

// Configurações de conexão com o banco de dados
$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verifica se a conexão foi estabelecida corretamente
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// Recupera o email do usuário logado na sessão
$email = $_SESSION['email'];

// Consulta SQL para recuperar nome e endereço do usuário
$sql = "SELECT nome, endereco, numero, complemento, bairro, cidade, cep FROM cliente WHERE email = '$email'";
$result = $conn->query($sql);

// Verifica se a consulta retornou resultados
if ($result->num_rows > 0) {
    // Recupera os dados do usuário
    $userData = $result->fetch_assoc();

    // Prepara os dados para retorno como JSON
    $response = [
        'nome' => $userData['nome'],
        'endereco' => $userData['endereco'],
        'numero' => $userData['numero'],
        'complemento' => $userData['complemento'],
        'bairro' => $userData['bairro'],
        'cidade' => $userData['cidade'],
        'cep' => $userData['cep']
    ];

    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Usuário não encontrado']);
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
