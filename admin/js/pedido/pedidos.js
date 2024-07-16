$(document).ready(function() {
    var pedidosAgrupados = []; // Declarar pedidosAgrupados no escopo global

    // Função para carregar dados de pedidos ao inicializar
    function carregarPedidos() {
        $.ajax({
            url: 'php/pedido/get_vendas.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Dados de Pedidos recebidos:', data);
                $('#tabela-pedidos').empty();

                if (data.length > 0) {
                    var table = '<table class="table table-bordered">';
                    table += '<thead style="background-color: #9c1de7; color: white;">';
                    table += '<tr>';
                    table += '<th>Cliente</th>';
                    table += '<th>Telefone</th>';
                    table += '<th>Horário</th>';
                    table += '<th>Pedidos</th>';
                    table += '<th>Valor</th>';
                    table += '<th>Valor Final</th>';
                    table += '<th>Forma de Pag.</th>';
                    table += '<th>Ações</th>'; // Nova coluna para as ações
                    table += '</tr>';
                    table += '</thead>';
                    table += '<tbody>';

                    // Variáveis para controlar agrupamento
                    var ultimoCliente = null;
                    var ultimaHora = null;
                    pedidosAgrupados = []; // Reinicializar pedidosAgrupados

                    // Função para calcular o valor total dos pedidos de um grupo
                    function calcularValorTotal(pedidos) {
                        var total = 0;
                        for (var i = 0; i < pedidos.length; i++) {
                            total += parseFloat(pedidos[i].valor_total);
                        }
                        return total.toFixed(2);
                    }

                    $.each(data, function(index, venda) {
                        if (venda.nome_cliente === ultimoCliente &&
                            venda.hora === ultimaHora) {
                            // Adicionar ao grupo existente
                            pedidosAgrupados[pedidosAgrupados.length - 1].pedidos.push(venda);
                        } else {
                            // Novo grupo de pedidos
                            pedidosAgrupados.push({
                                nome_cliente: venda.nome_cliente,
                                telefone_cliente: venda.telefone_cliente,
                                hora: venda.hora,
                                pedidos: [venda]
                            });

                            // Atualizar variáveis de controle
                            ultimoCliente = venda.nome_cliente;
                            ultimaHora = venda.hora;
                        }
                    });

                    // Construir linhas da tabela
                    $.each(pedidosAgrupados, function(index, grupo) {
                        var valorTotalPedidos = calcularValorTotal(grupo.pedidos);
                        var valorFinal = (parseFloat(valorTotalPedidos) + 10).toFixed(2);

                        // Iterar sobre os pedidos do grupo
                        $.each(grupo.pedidos, function(i, pedido) {
                            var linhaId = 'pedido-' + index + '-' + i; // Identificador único para a linha
                            table += '<tr id="' + linhaId + '">';

                            // Exibir informações do cliente apenas na primeira linha do grupo
                            if (i === 0) {
                                table += '<td rowspan="' + grupo.pedidos.length + '">' + grupo.nome_cliente + '</td>';
                                table += '<td rowspan="' + grupo.pedidos.length + '">' + grupo.telefone_cliente + '</td>';
                                table += '<td rowspan="' + grupo.pedidos.length + '">' + grupo.hora + '</td>';
                                table += '<td>' + pedido.nome_produto + ' (' + pedido.nomes_adicionais + ')</td>';
                                table += '<td>' + "R$ " + pedido.valor_total + '</td>';
                                table += '<td rowspan="' + grupo.pedidos.length + '"><strong>' + "R$ " + valorFinal + '</strong></td>';
                                table += '<td rowspan="' + grupo.pedidos.length + '">' + pedido.form_pag + '</td>';
                                table += '<td rowspan="' + grupo.pedidos.length + '">';
                                table += '<button class="btn-maps" onclick="abrirMaps(\'' + grupo.telefone_cliente + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="1em" viewBox="0 0 256 367"><path fill="#34a853" d="M70.585 271.865a371 371 0 0 1 28.911 42.642c7.374 13.982 10.448 23.463 15.837 40.31c3.305 9.308 6.292 12.086 12.714 12.086c6.998 0 10.173-4.726 12.626-12.035c5.094-15.91 9.091-28.052 15.397-39.525c12.374-22.15 27.75-41.833 42.858-60.75c4.09-5.354 30.534-36.545 42.439-61.156c0 0 14.632-27.035 14.632-64.792c0-35.318-14.43-59.813-14.43-59.813l-41.545 11.126l-25.23 66.451l-6.242 9.163l-1.248 1.66l-1.66 2.078l-2.914 3.319l-4.164 4.163l-22.467 18.304l-56.17 32.432z"/><path fill="#fbbc04" d="M12.612 188.892c13.709 31.313 40.145 58.839 58.031 82.995l95.001-112.534s-13.384 17.504-37.662 17.504c-27.043 0-48.89-21.595-48.89-48.825c0-18.673 11.234-31.501 11.234-31.501l-64.489 17.28z"/><path fill="#4285f4" d="M166.705 5.787c31.552 10.173 58.558 31.53 74.893 63.023l-75.925 90.478s11.234-13.06 11.234-31.617c0-27.864-23.463-48.68-48.81-48.68c-23.969 0-37.735 17.475-37.735 17.475v-57z"/><path fill="#1a73e8" d="M30.015 45.765C48.86 23.218 82.02 0 127.736 0c22.18 0 38.89 5.823 38.89 5.823L90.29 96.516H36.205z"/><path fill="#ea4335" d="M12.612 188.892S0 164.194 0 128.414c0-33.817 13.146-63.377 30.015-82.649l60.318 50.759z"/></svg></button><br>';
                                table += '<button class="btn-whatsapp" onclick="abrirWhatsApp(\'' + grupo.nome_cliente + '\', \'' + grupo.telefone_cliente + '\', \'' + pedido.nome_produto + '\', \'' + pedido.valor_total + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38"/><stop offset="100%" stop-color="#60d669"/></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9"/><stop offset="100%" stop-color="#fff"/></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/></svg></button>';
                                table += '</td>';

                                table += '</tr>';
                            } else {
                                // Se não for a primeira linha do grupo, apenas exibir informações do pedido
                                table += '<td>' + pedido.nome_produto + ' (' + pedido.nomes_adicionais + ')</td>';
                                table += '<td>' + "R$ " + pedido.valor_total + '</td>';
                                table += '</tr>';
                            }
                        });
                    });

                    table += '</tbody>';
                    table += '</table>';

                    $('#tabela-pedidos').html(table);

                    // Verificar se há novos pedidos para exibir o alerta
                    verificarNovosPedidos(pedidosAgrupados); // Passar pedidosAgrupados para a função
                } else {
                    $('#tabela-pedidos').html('<p>Nenhum pedido encontrado.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados de pedido:', status, error);
                $('#tabela-pedidos').html('<p>Erro ao carregar dados de pedido. Verifique o console para mais detalhes.</p>');
            }
        });
    }

    // Função para formatar a data no formato dd/mm/yyyy
    function formatData(data) {
        var partes = data.split('-');
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }

    // Variável global para controlar o último número de pedidos carregados
    var ultimoNumeroPedidos = 0;

    // Função para verificar novos pedidos e exibir alerta com SweetAlert2
    function verificarNovosPedidos(pedidosAgrupados) {
        // Verificar se há novos pedidos desde a última verificação
        var pedidos = [];
        pedidosAgrupados.forEach(function(grupo) {
            pedidos = pedidos.concat(grupo.pedidos);
        });
    
        if (pedidos.length > ultimoNumeroPedidos) {
            // Encontrar o pedido com o maior ID
            var maiorID = -1;
            var novoPedido = null;
    
            pedidos.forEach(function(pedido) {
                if (parseInt(pedido.id) > maiorID) {
                    maiorID = parseInt(pedido.id);
                    novoPedido = pedido;
                }
            });
    
            if (novoPedido) {
                console.log('Último pedido recebido:', novoPedido);
    
                // Encontrar o ID da linha do maior pedido na tabela
                var ultimoPedidoId = null;
                $.each(pedidosAgrupados, function(index, grupo) {
                    grupo.pedidos.forEach(function(pedido, i) {
                        if (pedido.id === novoPedido.id) {
                            ultimoPedidoId = 'pedido-' + index + '-' + i;
                            console.log('ID da linha do último pedido:', ultimoPedidoId);
                            return false; // Parar o loop ao encontrar o pedido correto
                        }
                    });
                    if (ultimoPedidoId) return false; // Parar o loop externo também
                });
    
                if (ultimoPedidoId) {
                    // Exibir alerta de novos pedidos apenas se houver novos pedidos
                    Swal.fire({
                        icon: 'success',
                        title: 'Novo Pedido Recebido!',
                        text: 'Cliente: ' + novoPedido.nome_cliente,
                        timer: 5000, // Fechar após 5 segundos
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false
                    });
    
                    // Adicionar destaque ao novo pedido
                    $('#' + ultimoPedidoId).addClass('novo-pedido');
    
                    // Remover destaque após 5 segundos
                    setTimeout(function() {
                        $('#' + ultimoPedidoId).removeClass('novo-pedido');
                    }, 5000);
                }
            }
    
            // Atualizar o número de pedidos carregados
            ultimoNumeroPedidos = pedidos.length;
        }
    }
    
    // Função para alternar dinamicamente as cores de destaque
    function alternarCoresDestaque() {
        var cores = ['#fa80ad', '#fffa9f', '#9c1de7'];
        var root = document.documentElement;
    
        setInterval(function() {
            root.style.setProperty('--cor1', cores[0]);
            root.style.setProperty('--cor2', cores[1]);
            root.style.setProperty('--cor3', cores[2]);
            cores.push(cores.shift()); // Rotacionar as cores
        }, 5000); // Troca de cor a cada 5 segundos
    }
    
    // Iniciar a alternância dinâmica de cores
    alternarCoresDestaque();

    // Função para abrir o WhatsApp com mensagem predefinida
    window.abrirWhatsApp = function(nome, telefone, pedidos, valorFinal) {
        // Remover caracteres não numéricos do telefone
        var telefoneLimpo = telefone.replace(/\D/g, '');

        // Adicionar código do país se não estiver presente (exemplo com código +55 para Brasil)
        if (!telefoneLimpo.startsWith('55')) {
            telefoneLimpo = '55' + telefoneLimpo;
        }

        var mensagem = encodeURIComponent("Olá " + nome + ", seus pedidos estão prontos para entrega!\n\nLogo o pedido irá chegar até você! \nQuer fazer um novo pedido?\nAcesse o nosso site: \n\nwww.chegouacai.shop!");
        var url = "https://wa.me/" + telefoneLimpo + "?text=" + mensagem;
        window.open(url);
    };

    // Função para abrir o Maps para o cliente específico
    window.abrirMaps = function(telefone) {
        // AJAX para buscar os dados de endereço do cliente
        $.ajax({
            url: 'php/pedido/get_endereco.php',
            type: 'POST',  // Certifique-se de que o método é POST
            dataType: 'json',
            data: { telefone: telefone },  // Passar o telefone como parte dos dados
            success: function(data) {
                if (data.success) {
                    var endereco = encodeURIComponent(data.endereco + ', ' + data.numero + ', ' + data.bairro + ', ' + data.cidade);
                    var url = 'https://www.google.com/maps/search/?api=1&query=' + endereco;
                    window.open(url);
                } else {
                    console.error('Erro ao obter dados de endereço:', data.message);
                    alert('Erro ao obter dados de endereço: ' + data.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro na requisição AJAX:', status, error);
                alert('Erro na requisição AJAX. Verifique o console para mais detalhes.');
            }
        });
    }

    // Chamar a função para carregar os pedidos ao inicializar a página
    carregarPedidos();

    // Configurar intervalo de recarregamento a cada 5 segundos
    setInterval(carregarPedidos, 5000);
});