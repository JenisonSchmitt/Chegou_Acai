$(document).ready(function() {
    console.log('Página carregada. Verificando se o cliente está logado...');
    checkLoggedIn();
    // Inicializar carrinho vazio se não existir na localStorage
    var carrinhoJSON = localStorage.getItem('carrinho');
    var carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : { pedidos: [] };

    var totalCarrinho = 0;
    var frete = 10.00; // Valor fixo do frete

    // Função para calcular o total do carrinho
    function calcularTotalCarrinho() {
        totalCarrinho = 0;
    
        carrinho.pedidos.forEach(function(pedido) {
            totalCarrinho += pedido.valor;
            pedido.adicionais.forEach(function(adicional) {
                totalCarrinho += adicional.valor;
            });
        });
    
        // Adiciona o frete ao total
        totalCarrinho += frete;
    
        // Exibe o frete e o valor total
        $('#total-carrinho1').html(`
            <span style="font-size: 0.8em; color: gray;">+ Frete: R$${frete.toFixed(2)}</span><br>
        `);
        $('#total-carrinho').text(`Total: R$${totalCarrinho.toFixed(2)}`);
    }

    carrinho.pedidos.forEach(function(pedido, index) {
        var pedidoHtml = `
            <div id="pedido${index + 1}" class="pedido-container">
                <button class="right excluir-pedido" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14"><path fill="red" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/></svg>
                </button>
                <h3 class="pedido-titulo">Pedido ${index + 1}</h3>
                <div class="produto-info">
                    <img src="images/produto/${pedido.nome.replace(/\s+/g, '').toLowerCase()}.jpeg" alt="${pedido.nome}" class="produto-imagem">
                    <div class="produto-texto">
                        <p class="produto-nome">${pedido.nome}</p>
                        <p class="produto-preco">R$${pedido.valor.toFixed(2)}</p>
                        <p class="produto-adicional">(2 adicionais gratuítos)</p>
                    </div>
                </div><br>
                <div class="left"> 
                    <h6 class="adicionais-titulo">Adicionais:</h6>
                </div>
                <div class="adicionais-container">
                    <ul class="adicionais-lista">
                        ${pedido.adicionais.map(adicional => `
                            <li class="adicional-item">
                                <div class="adicional-info">
                                    <img src="images/adicional/${adicional.nome.replace(/\s+/g, '').toLowerCase()}.jpeg" alt="${adicional.nome}" class="adicional-imagem">
                                    <div class="adicional-texto">
                                        <h5>${adicional.nome}</h5>
                                        <p>Valor: R$${adicional.valor.toFixed(2)}</p>
                                    </div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>`;

        $('#pedidos').append(pedidoHtml);

        // Adicionar valor do pedido ao total do carrinho
        totalCarrinho += pedido.valor;
        pedido.adicionais.forEach(function(adicional) {
            totalCarrinho += adicional.valor;
        });
    });

    // Exibir total inicial do carrinho
    calcularTotalCarrinho();

    // Evento de clique para excluir pedido
    $(document).on('click', '.excluir-pedido', function() {
        var index = $(this).data('index');
        
        // Remover o pedido do carrinho
        carrinho.pedidos.splice(index, 1);
        
        // Atualizar o carrinho na localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
        // Remover o elemento do DOM
        $('#pedido' + (index + 1)).remove();
        
        // Recalcular o total do carrinho
        calcularTotalCarrinho();
    });

    // Botão "Selecionar mais itens" redireciona para index.html
    var botaoHtml = `
        <div class="center buttons">
            <button id="btn-add-more" class="center button4">Novo Pedido</button>
        </div>`;
    $('#carrinho-container').append(botaoHtml);

    $('#btn-add-more').click(function() {
        window.location.href = 'index.html';
    });
    
    const pedidoContainer = document.querySelector('.pedido-container');
});

function enviarParaWhatsApp() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Função para calcular o total
    function calcularTotal(produtos, adicionais) {
        var totalProdutos = 0;
        var totalAdicionais = 0;

        // Somar o valor dos produtos
        if (produtos && produtos.length > 0) {
            totalProdutos = produtos.reduce((acc, produto) => acc + produto.valor, 0);
        }

        // Somar o valor dos adicionais
        if (adicionais && adicionais.length > 0) {
            totalAdicionais = adicionais.reduce((acc, adicional) => acc + adicional.valor, 0);
        }

        return totalProdutos + totalAdicionais;
    }

    // Consulta ao PHP para obter dados do usuário
    $.ajax({
        url: 'php/cliente/buscar_info.php', // Caminho para o arquivo PHP que busca informações do usuário
        type: 'GET', // Método GET pois não estamos enviando dados sensíveis
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                console.error('Erro ao obter dados do usuário:', data.error);
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                return;
            }

            // Dados do usuário recuperados com sucesso
            var mensagem = `Olá, me chamo ${data.nome}, resido em ${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade} (${data.complemento} - ${data.cep}) e estou interessado nos seguinte ítens:\n\n`;

            if (carrinho && carrinho.pedidos.length > 0) {
                carrinho.pedidos.forEach(function(pedido) {
                    mensagem += `\n-Tamanho: ${pedido.nome}\n`;

                    if (pedido.adicionais.length > 0) {
                        mensagem += "\nAdicionais:\n";
                        pedido.adicionais.forEach(function(adicional) {
                            mensagem += `- ${adicional.nome}\n`;
                        });
                    }
                });

                var totalProdutos = carrinho.pedidos.reduce((acc, pedido) => acc + pedido.valor, 0);
                var totalAdicionais = carrinho.pedidos.flatMap(pedido => pedido.adicionais).reduce((acc, adicional) => acc + adicional.valor, 0);
                var total = totalProdutos + totalAdicionais + 10.00; // Adicionando o valor do frete

                mensagem += `\n+Frete: R$10,00`;
                mensagem += `\n*Total: R$${total.toFixed(2)}*\n`;
                mensagem += `\n*Pagamento a Combinar!*\n`;
            } else {
                mensagem = "Meu carrinho está vazio!";
            }

            // Substitua o número de telefone abaixo pelo seu número do WhatsApp
            var numeroWhatsApp = "48999961608";
            var linkWhatsApp = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem);

            // Redirecionar para o link do WhatsApp na mesma aba
            window.location.href = linkWhatsApp;

        },
        error: function(xhr, status, error) {
            console.error('Erro ao obter dados do usuário:', error);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    });
}

function enviarParaWhatsApp_pix() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Função para calcular o total
    function calcularTotal(produtos, adicionais) {
        var totalProdutos = 0;
        var totalAdicionais = 0;

        // Somar o valor dos produtos
        if (produtos && produtos.length > 0) {
            totalProdutos = produtos.reduce((acc, produto) => acc + produto.valor, 0);
        }

        // Somar o valor dos adicionais
        if (adicionais && adicionais.length > 0) {
            totalAdicionais = adicionais.reduce((acc, adicional) => acc + adicional.valor, 0);
        }

        return totalProdutos + totalAdicionais;
    }

    // Consulta ao PHP para obter dados do usuário
    $.ajax({
        url: 'php/cliente/buscar_info.php', // Caminho para o arquivo PHP que busca informações do usuário
        type: 'GET', // Método GET pois não estamos enviando dados sensíveis
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                console.error('Erro ao obter dados do usuário:', data.error);
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                return;
            }

            // Dados do usuário recuperados com sucesso
            var mensagem = `Olá, me chamo ${data.nome}, resido em ${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade} (${data.complemento} - ${data.cep}) e estou interessado nos seguinte ítens:\n\n`;

            if (carrinho && carrinho.pedidos.length > 0) {
                carrinho.pedidos.forEach(function(pedido) {
                    mensagem += `\n-Tamanho: ${pedido.nome}\n`;

                    if (pedido.adicionais.length > 0) {
                        mensagem += "\nAdicionais:\n";
                        pedido.adicionais.forEach(function(adicional) {
                            mensagem += `- ${adicional.nome}\n`;
                        });
                    }
                });

                var totalProdutos = carrinho.pedidos.reduce((acc, pedido) => acc + pedido.valor, 0);
                var totalAdicionais = carrinho.pedidos.flatMap(pedido => pedido.adicionais).reduce((acc, adicional) => acc + adicional.valor, 0);
                var total = totalProdutos + totalAdicionais + 10.00; // Adicionando o valor do frete

                mensagem += `\n+Frete: R$10,00`;
                mensagem += `\n*Total: R$${total.toFixed(2)}*\n`;
                mensagem += `\n*Pagamento já realizado via PIX!*\n`;
            } else {
                mensagem = "Meu carrinho está vazio!";
            }

            // Substitua o número de telefone abaixo pelo seu número do WhatsApp
            var numeroWhatsApp = "48999961608";
            var linkWhatsApp = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem);

            // Redirecionar para o link do WhatsApp na mesma aba
            window.location.href = linkWhatsApp;

        },
        error: function(xhr, status, error) {
            console.error('Erro ao obter dados do usuário:', error);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    });
}

function enviarParaWhatsApp_cartao() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Função para calcular o total
    function calcularTotal(produtos, adicionais) {
        var totalProdutos = 0;
        var totalAdicionais = 0;

        // Somar o valor dos produtos
        if (produtos && produtos.length > 0) {
            totalProdutos = produtos.reduce((acc, produto) => acc + produto.valor, 0);
        }

        // Somar o valor dos adicionais
        if (adicionais && adicionais.length > 0) {
            totalAdicionais = adicionais.reduce((acc, adicional) => acc + adicional.valor, 0);
        }

        return totalProdutos + totalAdicionais;
    }

    // Consulta ao PHP para obter dados do usuário
    $.ajax({
        url: 'php/cliente/buscar_info.php', // Caminho para o arquivo PHP que busca informações do usuário
        type: 'GET', // Método GET pois não estamos enviando dados sensíveis
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                console.error('Erro ao obter dados do usuário:', data.error);
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                return;
            }

            // Dados do usuário recuperados com sucesso
            var mensagem = `Olá, me chamo ${data.nome}, resido em ${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade} (${data.complemento} - ${data.cep}) e estou interessado nos seguinte ítens:\n\n`;

            if (carrinho && carrinho.pedidos.length > 0) {
                carrinho.pedidos.forEach(function(pedido) {
                    mensagem += `\n-Tamanho: ${pedido.nome}\n`;

                    if (pedido.adicionais.length > 0) {
                        mensagem += "\nAdicionais:\n";
                        pedido.adicionais.forEach(function(adicional) {
                            mensagem += `- ${adicional.nome}\n`;
                        });
                    }
                });

                var totalProdutos = carrinho.pedidos.reduce((acc, pedido) => acc + pedido.valor, 0);
                var totalAdicionais = carrinho.pedidos.flatMap(pedido => pedido.adicionais).reduce((acc, adicional) => acc + adicional.valor, 0);
                var total = totalProdutos + totalAdicionais + 10.00; // Adicionando o valor do frete

                mensagem += `\n+Frete: R$10,00`;
                mensagem += `\n*Total: R$${total.toFixed(2)}*\n`;
                mensagem += `\n*Pagamento já realizado via Cartão de Crédito!*\n`;
            } else {
                mensagem = "Meu carrinho está vazio!";
            }

            // Substitua o número de telefone abaixo pelo seu número do WhatsApp
            var numeroWhatsApp = "48999961608";
            var linkWhatsApp = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem);

            // Redirecionar para o link do WhatsApp na mesma aba
            window.location.href = linkWhatsApp;

        },
        error: function(xhr, status, error) {
            console.error('Erro ao obter dados do usuário:', error);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    });
}

function enviarParaWhatsAppFechado() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // Função para calcular o total
    function calcularTotal(produtos, adicionais) {
        var totalProdutos = 0;
        var totalAdicionais = 0;

        // Somar o valor dos produtos
        if (produtos && produtos.length > 0) {
            totalProdutos = produtos.reduce((acc, produto) => acc + produto.valor, 0);
        }

        // Somar o valor dos adicionais
        if (adicionais && adicionais.length > 0) {
            totalAdicionais = adicionais.reduce((acc, adicional) => acc + adicional.valor, 0);
        }

        return totalProdutos + totalAdicionais;
    }

    // Consulta ao PHP para obter dados do usuário
    $.ajax({
        url: 'php/cliente/buscar_info.php', // Caminho para o arquivo PHP que busca informações do usuário
        type: 'GET', // Método GET pois não estamos enviando dados sensíveis
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                console.error('Erro ao obter dados do usuário:', data.error);
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                return;
            }

            // Dados do usuário recuperados com sucesso
            var mensagem = `Olá, me chamo ${data.nome}, resido em ${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade} (${data.complemento} - ${data.cep}) e gostaria de realizar um pedido quando o local abrir:\n\n`;

            if (carrinho && carrinho.pedidos.length > 0) {
                carrinho.pedidos.forEach(function(pedido) {
                    mensagem += `\n-Tamanho: ${pedido.nome}\n`;

                    if (pedido.adicionais.length > 0) {
                        mensagem += "\nAdicionais:\n";
                        pedido.adicionais.forEach(function(adicional) {
                            mensagem += `- ${adicional.nome}\n`;
                        });
                    }
                });

                var totalProdutos = carrinho.pedidos.reduce((acc, pedido) => acc + pedido.valor, 0);
                var totalAdicionais = carrinho.pedidos.flatMap(pedido => pedido.adicionais).reduce((acc, adicional) => acc + adicional.valor, 0);
                var total = totalProdutos + totalAdicionais + 10.00; // Adicionando o valor do frete

                mensagem += `\n+Frete: R$10,00`;
                mensagem += `\n*Total: R$${total.toFixed(2)}*\n`;
            } else {
                mensagem = "Meu carrinho está vazio!";
            }

            // Substitua o número de telefone abaixo pelo seu número do WhatsApp
            var numeroWhatsApp = "48999961608";
            var linkWhatsApp = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem);

            // Redirecionar para o link do WhatsApp na mesma aba
            window.location.href = linkWhatsApp;

        },
        error: function(xhr, status, error) {
            console.error('Erro ao obter dados do usuário:', error);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    });
}