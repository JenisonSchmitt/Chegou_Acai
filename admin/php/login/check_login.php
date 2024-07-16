<?php
session_start();

// Verifica se o cliente está logado
if (isset($_SESSION['email'])) {
    // Cliente está logado, retorna um JSON indicando isso
    header('Content-Type: application/json');
    echo json_encode(array("logged_in" => true));
} else {
    // Se o cliente não estiver logado, retorna um JSON indicando isso
    header('Content-Type: application/json');
    echo json_encode(array("logged_in" => false));
}
?>
