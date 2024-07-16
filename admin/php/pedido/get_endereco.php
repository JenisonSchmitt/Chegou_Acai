<?php
// Configurações do banco de dados
$servername = "localhost";
$database = "u228502032_chegouacai";
$username = "u228502032_chegouacai";
$password = "#ChegouAcai1342";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Erro na conexão: ' . $e->getMessage());
}

// Verifica se o telefone foi enviado via POST
if (isset($_POST['telefone'])) {
    $telefone = $_POST['telefone'];

    // Consulta SQL para obter o endereço do cliente
    $sql = "SELECT endereco, numero, bairro, cidade FROM cliente WHERE telefone = :telefone";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':telefone', $telefone);
    $stmt->execute();
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        // Retorna os dados de endereço como JSON
        echo json_encode(array(
            'success' => true,
            'endereco' => $resultado['endereco'],
            'numero' => $resultado['numero'],
            'bairro' => $resultado['bairro'],
            'cidade' => $resultado['cidade']
        ));
    } else {
        echo json_encode(array(
            'success' => false,
            'message' => 'Cliente não encontrado ou sem endereço cadastrado.'
        ));
    }
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Telefone não foi recebido.'
    ));
}
?>
