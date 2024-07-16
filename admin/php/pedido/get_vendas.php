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

// Define o fuso horário para São Paulo (SP-BR)
date_default_timezone_set('America/Sao_Paulo');

// Constrói a data de hoje no formato do MySQL (YYYY-MM-DD)
$data_hoje = date('Y-m-d');

// Query SQL para selecionar dados da tabela 'venda' onde data é igual a hoje, ordenados por data e hora
$sql = "SELECT * FROM venda WHERE data = '$data_hoje' ORDER BY data ASC, hora DESC";
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
    echo json_encode(array('mensagem' => 'Nenhum pedido encontrado para hoje.'));
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>
