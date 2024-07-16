$(document).ready(function() {
    // Carregar produtos
    $.ajax({
        url: 'php/produto/get_informacoes.php', // URL para o script PHP que busca os produtos no DB
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); // Verificar o formato dos dados recebidos
            if (Array.isArray(data)) {
                data.forEach(function(produto) {
                    var produtoHtml = `
                        <div class="produto col-4 col-6-medium col-12-small">
                           <section data-id="${produto.id}" onclick="selecionarProduto(this)">
                                <h3 class="nomeproduto">${produto.nome}</h3>
                                <img src='images/produto/${produto.nome.replace(/\s+/g, '').toLowerCase()}.jpeg' alt='${produto.nome}' style='width: 200px;'>
                                <header>
                                    <h3 class="descricao1produto">${produto.descricao1}</h3>
                                </header>
                                <p class="center descricao2produto">${produto.descricao2}</p>
                                <h2 class="valor precoproduto">R$${produto.valor}</h2>
                                <p class="center adicionais">${produto.adicional} adicionais gratuitos</p>
                                <div class="col-12 buttons">
                                    <li><a class="button1">Selecionar</a></li>
                                </div>
                            </section>
                        </div><br>`;
                    $('#produtos-container .row').append(produtoHtml);
                });
            } else {
                console.error('Erro: dados de produtos não encontrados.');
            }
        },
        error: function(error) {
            console.error('Erro ao carregar produtos:', error);
        }
    });

    // Carregar adicionais
    $.ajax({
        url: 'php/produto/get_informacoesadc.php', // URL para o script PHP que busca os adicionais no DB
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); // Verificar o formato dos dados recebidos
            if (Array.isArray(data)) {
                data.forEach(function(adicional) {
                    var adicionalHtml = `
                        <div class="adicional">
                            <section data-id="${adicional.id}" onclick="selecionarAdicional(this)">
                                <h3 class="nomeadicional">${adicional.nome}</h3>
                                <img src='images/adicional/${adicional.nome.replace(/\s+/g, '').toLowerCase()}.jpeg' alt='${adicional.nome}' style='max-width: 150px; max-height: 150px;'>
                                <h4 class="valor precoadicional">R$${adicional.valor}</h4>
                                <div class="buttons">
                                    <li><a class="button1">Selecionar</a></li>
                                </div>
                            </section>
                        </div>`;
                    $('#adicionais-container').append(adicionalHtml);
                });
            } else {
                console.error('Erro: dados de adicionais não encontrados.');
            }
        },
        error: function(error) {
            console.error('Erro ao carregar adicionais:', error);
        }
    });
});