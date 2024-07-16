<?php
// Inicia a sessão se ela não estiver iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Destrói a sessão, removendo todos os dados associados a ela
session_destroy();

// Redireciona para a página de login (ou qualquer outra página desejada após logout)
header("Location: ../../index.html");
exit;
?>
