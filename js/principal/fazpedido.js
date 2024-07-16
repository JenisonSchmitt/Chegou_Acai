var proximoPedido = 1; // Inicializa o próximo número de pedido
var AdicionaisDisponiveis = 0; // Inicializa o contador de adicionais disponíveis gratuitos

function adicionarAoCarrinho(nome, valor, tipo) {
    var carrinhoJSON = localStorage.getItem('carrinho');
    var carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : { pedidos: [] };

    console.log('Tipo de adição:', tipo);
    console.log('Nome:', nome);
    console.log('Valor:', valor);

    if (tipo === 'produto') {
        console.log('Adicionando produto ao carrinho...');
        carrinho.pedidos.push({ pedido: proximoPedido++, nome: nome, valor: valor, adicionais: [] });
        AdicionaisDisponiveis = 0; // Reinicia o contador de adicionais disponíveis ao adicionar novo produto
    } else {
        var pedidoAtualIndex = carrinho.pedidos.length - 1; // Último pedido adicionado
        if (pedidoAtualIndex > -1) {
            // Verifica se ainda há adicionais gratuitos disponíveis
            if (AdicionaisDisponiveis < 2) {
                AdicionaisDisponiveis++;
                valor = 0.00; // Define o valor do adicional como gratuito
            }
            carrinho.pedidos[pedidoAtualIndex].adicionais.push({ nome: nome, valor: valor });
            console.log('Adicional selecionado:', nome);
            console.log('Valor do adicional:', valor);
        }
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    console.log('Carrinho atualizado:', carrinho);
}

function selecionarProduto(botaoSelecionado) {
    var section = $(botaoSelecionado).closest('section');
    var nomeProduto = section.find('.nomeproduto').text().trim();
    var valorProduto = parseFloat(section.find('.precoproduto').text().replace('R$', '').trim());

    console.log('Produto selecionado:', nomeProduto);
    console.log('Valor do produto:', valorProduto);

    adicionarAoCarrinho(nomeProduto, valorProduto, 'produto');
    nextStep(1, 'step2');
}

function selecionarAdicional(botaoSelecionado) {
    var section = $(botaoSelecionado).closest('section');
    var nomeAdicional = section.find('.nomeadicional').text().trim();
    var valorAdicional = parseFloat(section.find('.precoadicional').text().replace('R$', '').trim());

    console.log('Adicional selecionado:', nomeAdicional);
    console.log('Valor do adicional:', valorAdicional);

    adicionarAoCarrinho(nomeAdicional, valorAdicional, 'adicional');

    Swal.fire({
        icon: 'success',
        title: 'Adicional selecionado com sucesso!',
        showConfirmButton: false,
        showCancelButton: false,
        footer: `
            <button id="btn-finish" class="swal-button swal2-styled">Finalizar pedido</button>
            <button id="btn-add-more" class="swal-button swal2-styled">Adicionar mais itens</button>
        `,
        didRender: () => {
            document.getElementById('btn-finish').addEventListener('click', () => {
                window.location.href = 'carrinho.html#carrinho';
            });
            document.getElementById('btn-add-more').addEventListener('click', () => {
                Swal.close();
            });
        }
    });
}

$(document).on('click', '#btn-finish2', function() {
    window.location.href = 'carrinho.html';
});