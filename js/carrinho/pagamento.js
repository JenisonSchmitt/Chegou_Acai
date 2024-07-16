function realizarPagamentoViaCartao() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));
    var totalCarrinho = 0;
    var frete = 10.00; // Valor fixo do frete

    carrinho.pedidos.forEach(function(pedido) {
        totalCarrinho += pedido.valor;
        pedido.adicionais.forEach(function(adicional) {
            totalCarrinho += adicional.valor;
        });
    });

    totalCarrinho += frete;
    
    var valorFinal = totalCarrinho.toFixed(2).replace('.', ',');
    
    console.log(valorFinal);

    // URL do pagamento
    var url = `https://pay.infinitepay.io/chegou-acai/${valorFinal}`;

    // Abrindo o popup com SweetAlert
    Swal.fire({
        title: 'Pagamento via Cartão de Crédito',
        html: `
            <div style="text-align: center;">
                <iframe src="${url}" width="100%" height="400" style="border: none; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);"></iframe>
                <div class = "center">
                <p class="center white" style="margin-top: 20px; font-size: 16px;">Já Realizou o Pagamento? 👇</p></div>
            </div>
        `,
        confirmButtonColor: '#9c1de7', // Cor do botão de confirmação
        showCancelButton: false,
        confirmButtonText: 'Concluir Pedido',
        preConfirm: () => {
            realizarPagamentoWhatsapp_cartao();
        }
    });
}

function realizarPagamentoViaPix() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));
    var totalCarrinho = 0;
    var frete = 10.00; // Valor fixo do frete

    carrinho.pedidos.forEach(function(pedido) {
        totalCarrinho += pedido.valor;
        pedido.adicionais.forEach(function(adicional) {
            totalCarrinho += adicional.valor;
        });
    });

    totalCarrinho += frete;

    Swal.fire({
        title: 'Pagamento via Pix',
        html: `
            <div class="center">
                <h3 class="yellow">Valor Total: R$${totalCarrinho.toFixed(2)}</h3>
                <h4 class="white">Chave Pix: <span id="chave-pix">(48) 9 9996-1608</span></h4><br>
                <button id="copiar-chave-pix" class="custom-swal-button pix">Copiar Chave Pix</button><br><hr><br>
                <div class = "center">
                <p class="center white" style="margin-top: 20px; font-size: 16px;">Já Realizou o Pagamento? 👇</p></div>                    
            </div>
        `,
        showCancelButton: false,
        confirmButtonColor: '#9c1de7', // Cor do botão de confirmação
        confirmButtonText: 'Concluir Pedido', // Texto do botão de confirmação
        didOpen: () => {
            document.getElementById('copiar-chave-pix').addEventListener('click', function() {
                var chavePix = document.getElementById('chave-pix').innerText;
                navigator.clipboard.writeText(chavePix).then(function() {
                    // Exibir alerta simples ao copiar a chave Pix
                    alert('Chave Pix copiada!');
                }, function(err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao copiar',
                        text: 'Não foi possível copiar a chave Pix. Tente novamente.',
                        showConfirmButton: true
                    });
                });
            });
    
            // Substitui a ação padrão do botão de confirmação
            Swal.getConfirmButton().addEventListener('click', function() {
                realizarPagamentoWhatsapp_pix(); // Chama a função para concluir o pedido via Pix
                Swal.close(); // Fecha o modal após concluir o pedido
            });
        }
    });
}

// Função para finalizar o pedido
function realizarPagamentoWhatsapp_cartao() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Montar objeto com os dados a serem enviados para o PHP
    var dadosPedido = {
        carrinho: carrinho,
        frete: 10.00, // Valor fixo do frete
        pagamento: 'Cartão',
    };

    // Realizar requisição AJAX para verificar o estado de abertura do estabelecimento
    fetch('admin/php/estado.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Verifica o estado atual da barbearia
            if (data.estado_barbearia === 'aberto') {
                // Se aberto, então realiza o pedido
                $.ajax({
                    url: 'php/carrinho/processa_pedido.php',
                    type: 'POST',
                    dataType: 'json',
                    data: dadosPedido,
                    success: function(response) {
                        if (response.success) {
                            // Exibir popup de sucesso por alguns segundos
                            Swal.fire({
                                icon: 'success',
                                title: 'Pedido finalizado com sucesso!',
                                html: '<span style="color: white;">Seu pedido já foi recebido e em breve chegará até você!</span>',
                                timer: 3000, // Exibir por 3 segundos
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                    setTimeout(() => {
                                        // Redirecionar para o WhatsApp após o tempo definido
                                        enviarParaWhatsApp_cartao();
                                        // Limpar o carrinho local após o pedido ser finalizado com sucesso
                                        localStorage.removeItem('carrinho');

                                        atualizarInterfaceCarrinhoVazio();
                                    }, 3000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ao finalizar pedido',
                                text: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
                                showConfirmButton: true
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao finalizar pedido:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao finalizar pedido',
                            text: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
                            showConfirmButton: true
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao finalizar pedido',
                    html: '<span style="color: white;">Desculpe, estamos fechados no momento. Por favor, tente novamente mais tarde!</span>',
                    confirmButtonColor: '#581b98', // Cor do botão de confirmação
                    confirmButtonText: 'OK', // Texto do botão de confirmação
                    didOpen: () => {
                        setTimeout(() => {
                            // Redirecionar para o WhatsApp após o tempo definido
                            enviarParaWhatsAppFechado();
                        }, 2000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar estado:', error); // Captura erros na busca do estado
            Swal.fire({
                icon: 'error',
                title: 'Erro ao verificar estado',
                text: 'Ocorreu um erro ao verificar o estado do estabelecimento. Por favor, tente novamente.',
                showConfirmButton: true
            });
        });
}

        // Função para finalizar o pedido
function realizarPagamentoWhatsapp_pix() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Montar objeto com os dados a serem enviados para o PHP
    var dadosPedido = {
        carrinho: carrinho,
        frete: 10.00, // Valor fixo do frete
        pagamento: 'PIX',
    };

    // Realizar requisição AJAX para verificar o estado de abertura do estabelecimento
    fetch('admin/php/estado.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Verifica o estado atual da barbearia
            if (data.estado_barbearia === 'aberto') {
                // Se aberto, então realiza o pedido
                $.ajax({
                    url: 'php/carrinho/processa_pedido.php',
                    type: 'POST',
                    dataType: 'json',
                    data: dadosPedido,
                    success: function(response) {
                        if (response.success) {
                            // Exibir popup de sucesso por alguns segundos
                            Swal.fire({
                                icon: 'success',
                                title: 'Pedido finalizado com sucesso!',
                                html: '<span style="color: white;">Seu pedido já foi recebido e em breve chegará até você!</span>',
                                timer: 3000, // Exibir por 3 segundos
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                    setTimeout(() => {
                                        // Redirecionar para o WhatsApp após o tempo definido
                                        enviarParaWhatsApp_pix();
                                        // Limpar o carrinho local após o pedido ser finalizado com sucesso
                                        localStorage.removeItem('carrinho');

                                        atualizarInterfaceCarrinhoVazio();
                                    }, 3000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ao finalizar pedido',
                                text: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
                                showConfirmButton: true
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao finalizar pedido:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao finalizar pedido',
                            text: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
                            showConfirmButton: true
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao finalizar pedido',
                    html: '<span style="color: white;">Desculpe, estamos fechados no momento. Por favor, tente novamente mais tarde!</span>',
                    confirmButtonColor: '#581b98', // Cor do botão de confirmação
                    confirmButtonText: 'OK', // Texto do botão de confirmação
                    didOpen: () => {
                        setTimeout(() => {
                            // Redirecionar para o WhatsApp após o tempo definido
                            enviarParaWhatsAppFechado();
                        }, 2000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar estado:', error); // Captura erros na busca do estado
            Swal.fire({
                icon: 'error',
                title: 'Erro ao verificar estado',
                text: 'Ocorreu um erro ao verificar o estado do estabelecimento. Por favor, tente novamente.',
                showConfirmButton: true
            });
        });
}


// Função para finalizar o pedido
function realizarPagamentoWhatsapp() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Montar objeto com os dados a serem enviados para o PHP
    var dadosPedido = {
        carrinho: carrinho,
        frete: 10.00, // Valor fixo do frete
        pagamento: 'A Combinar',
    };

    // Realizar requisição AJAX para verificar o estado de abertura do estabelecimento
    fetch('admin/php/estado.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Verifica o estado atual da barbearia
            if (data.estado_barbearia === 'aberto') {
                // Se aberto, então realiza o pedido
                $.ajax({
                    url: 'php/carrinho/processa_pedido.php',
                    type: 'POST',
                    dataType: 'json',
                    data: dadosPedido,
                    success: function(response) {
                        if (response.success) {
                            // Exibir popup de sucesso por alguns segundos
                            Swal.fire({
                                icon: 'success',
                                title: 'Pedido finalizado com sucesso!',
                                html: '<span style="color: white;">Seu pedido já foi recebido e em breve chegará até você!</span>',
                                timer: 3000, // Exibir por 3 segundos
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                    setTimeout(() => {
                                        // Redirecionar para o WhatsApp após o tempo definido
                                        enviarParaWhatsApp();
                                        // Limpar o carrinho local após o pedido ser finalizado com sucesso
                                        localStorage.removeItem('carrinho');

                                        atualizarInterfaceCarrinhoVazio();
                                    }, 3000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ao finalizar pedido',
                                html: '<span style="color: white;">Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.</span>',
                                showConfirmButton: true
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao finalizar pedido:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao finalizar pedido',
                            html: '<span style="color: white;">Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.</span>',
                            showConfirmButton: true
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao finalizar pedido',
                    html: '<span style="color: white;">Desculpe, estamos fechados no momento. Por favor, tente novamente mais tarde!</span>',
                    confirmButtonColor: '#581b98', // Cor do botão de confirmação
                    confirmButtonText: 'OK', // Texto do botão de confirmação
                    didOpen: () => {
                        setTimeout(() => {
                            // Redirecionar para o WhatsApp após o tempo definido
                            enviarParaWhatsAppFechado();
                        }, 2000); // Espera 3 segundos antes de chamar enviarParaWhatsApp()
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar estado:', error); // Captura erros na busca do estado
            Swal.fire({
                icon: 'error',
                title: 'Erro ao verificar estado',
                text: 'Ocorreu um erro ao verificar o estado do estabelecimento. Por favor, tente novamente.',
                showConfirmButton: true
            });
        });
}

function atualizarInterfaceCarrinhoVazio() {
    // Atualizar a interface do carrinho para refletir que ele está vazio
    $('#pedidos').empty();
    $('#total-carrinho1').html('<span style="font-size: 0.8em; color: gray;">+ Frete: R$0.00</span><br>');
    $('#total-carrinho').text('Total: R$0.00');
    Swal.fire({
        icon: 'info',
        title: 'Carrinho Limpo',
        html: '<span style="color: white;">O carrinho foi limpo com sucesso!</span>',
        showConfirmButton: false,
        timer: 1500
    });
}

function finalizarPedido() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Verifica se o estabelecimento está aberto
    var statusBarbearia = document.getElementById('statusBarbearia');
    if (statusBarbearia && statusBarbearia.innerText.trim() === 'Fechado') {
        // Mostra um popup informando que o estabelecimento está fechado
        Swal.fire({
            icon: 'error',
            title: 'Erro ao finalizar pedido',
            html: '<span style="color: white;">Desculpe, estamos fechados no momento. Por favor, tente novamente mais tarde!</span>',
            confirmButtonColor: '#581b98',
            confirmButtonText: 'OK',
            didOpen: () => {
                setTimeout(() => {
                    enviarParaWhatsAppFechado(); // Chama a função após 3 segundos
                }, 3000);
            }
        });
        return;
    }

    // Exibir popup com as opções de pagamento
    Swal.fire({
        icon: 'info',
        title: 'Como deseja finalizar seu pedido?',
        confirmButtonColor: '#581b98',
        confirmButtonText: 'Voltar',
        html: `
            <button class="custom-swal-button pix" onclick="realizarPagamentoViaPix()">Realizar pagamento via Pix</button>
            <button class="custom-swal-button cartao" onclick="realizarPagamentoViaCartao()">Realizar pagamento via Cartão de Crédito</button>
            <button class="custom-swal-button whatsapp" onclick="realizarPagamentoWhatsapp()">Finalizar pelo Whatsapp</button>
        `
    });
}
