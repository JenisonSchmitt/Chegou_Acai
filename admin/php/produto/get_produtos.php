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

// Query SQL para selecionar dados da tabela 'adicional'
$sql = "SELECT id, nome, descricao1, descricao2, valor, adicional FROM produto";
$resultado = $conexao->query($sql);

// Verifica se a consulta retornou resultados
if ($resultado->num_rows > 0) {
    $dados = array();
    // Loop através dos resultados e armazena em um array associativo
    while ($row = $resultado->fetch_assoc()) {
        $dados[] = $row;
    }
    // Retorna os dados como JSON
    echo json_encode($dados);
} else {
    // Se não houver resultados, retorna um JSON vazio ou uma mensagem de erro
    echo json_encode(array('mensagem' => 'Nenhum adicional encontrado.'));
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>
