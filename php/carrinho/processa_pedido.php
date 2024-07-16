<?php
session_start();

// Definir o fuso horário para o Brasil
date_default_timezone_set('America/Sao_Paulo');

// Verificar se os dados foram recebidos via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar se há dados válidos
    $carrinho = isset($_POST['carrinho']) ? $_POST['carrinho'] : null;
    $frete = isset($_POST['frete']) ? $_POST['frete'] : 10.00; // Valor fixo do frete
    $pag = isset($_POST['pagamento']) ? $_POST['pagamento'] : null; // Valor fixo do frete

    // Validar e processar os dados do carrinho
    if ($carrinho) {
        // Configurações do banco de dados
        $servername = "localhost";
        $database = "u228502032_chegouacai";
        $username = "u228502032_chegouacai";
        $password = "#ChegouAcai1342";

        // Criar conexão com o banco de dados
        $conn = new mysqli($servername, $username, $password, $database);

        // Verificar conexão
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Verificar se o email do cliente está na sessão
        if (isset($_SESSION['email'])) {
            $email_cliente = $_SESSION['email'];

            // Consultar a tabela de clientes para obter o nome e o telefone
            $sql = "SELECT nome, telefone FROM cliente WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email_cliente);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Obter os dados do cliente
                $row = $result->fetch_assoc();
                $nome_cliente = $row['nome'];
                $telefone_cliente = $row['telefone'];
            } else {
                // Se não encontrar o cliente, retornar erro
                echo json_encode(array('success' => false, 'message' => 'Cliente não encontrado.'));
                $conn->close();
                exit;
            }
        } else {
            // Se o email não estiver na sessão, retornar erro
            echo json_encode(array('success' => false, 'message' => 'Email não encontrado na sessão.'));
            $conn->close();
            exit;
        }

        // Preparar e executar a inserção dos dados do pedido na tabela 'venda'
        foreach ($carrinho['pedidos'] as $pedido) {
            $nome_produto = $pedido['nome'];
            $valor_produto = $pedido['valor'];

            // Calcular o valor total do pedido (produto principal + adicionais)
            $valor_total = $valor_produto; // Começa com o valor do produto principal

            if (isset($pedido['adicionais']) && is_array($pedido['adicionais'])) {
                foreach ($pedido['adicionais'] as $adicional) {
                    // Somar o valor do adicional ao valor total
                    $valor_total += $adicional['valor'];
                }
            }

            // Formatar os nomes dos adicionais para inserção no banco de dados
            $nomes_adicionais_array = array_map(function($adicional) {
                return isset($adicional['nome']) ? $adicional['nome'] : '';
            }, $pedido['adicionais']);

            $nomes_adicionais = implode(', ', array_filter($nomes_adicionais_array));

            // Inserir data e hora formatada
            $data = date('Y-m-d');
            $hora = date('H:i:s');

            // SQL para inserção dos dados
            $sql = "INSERT INTO venda (nome_cliente, telefone_cliente, nome_produto, nomes_adicionais, valor_total, form_pag, data, hora) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            // Preparar a declaração
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                echo json_encode(array('success' => false, 'message' => 'Erro na preparação da declaração.'));
                $conn->close();
                exit;
            }

            // Vincular parâmetros
            $stmt->bind_param('ssssssss', $nome_cliente, $telefone_cliente, $nome_produto, $nomes_adicionais, $valor_total, $pag, $data, $hora);

            // Executar a declaração
            if ($stmt->execute() === false) {
                echo json_encode(array('success' => false, 'message' => 'Erro na execução da declaração.'));
                $stmt->close();
                $conn->close();
                exit;
            }

            // Fechar a declaração
            $stmt->close();
        }

        // Fechar a conexão
        $conn->close();

        // Sucesso na inserção
        echo json_encode(array('success' => true));
        exit;
    }
}

// Se chegou aqui, houve algum erro
echo json_encode(array('success' => false));
exit;
?>
