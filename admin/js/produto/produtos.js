$(document).ready(function() {
    $('#link-produto').on('shown.bs.tab', function(e) {
        console.log('Aba Produto foi mostrada.');

        $.ajax({
            url: 'php/produto/get_produtos.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Dados de produtos recebidos:', data);

                $('#tabela-produtos').empty();

                if (data.length > 0) {
                    var table = '<table class="table table-bordered">';
                    table += '<thead style="background-color: #9c1de7; color: white;">';
                    table += '<tr>';
                    table += '<th>Nome</th>';
                    table += '<th>Descrição Principal</th>';
                    table += '<th>Descrição Secundária</th>';
                    table += '<th>Valor</th>';
                    table += '<th>Adicional</th>';
                    table += '<th>Ações</th>';
                    table += '</tr>';
                    table += '</thead>';
                    table += '<tbody>';

                    $.each(data, function(index, produto) {
                        table += '<tr>';
                        table += '<td>' + produto.nome + '</td>';
                        table += '<td>' + produto.descricao1 + '</td>';
                        table += '<td>' + produto.descricao2 + '</td>';
                        table += '<td>' + "R$ " + produto.valor + '</td>';
                        table += '<td>' + "Adicionais: " + produto.adicional + '</td>';
                        table += '<td>';
                        table += '<button class="btn-editar-produto" data-id="' + produto.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#581b98" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg></button> ';
                        table += '<button class="btn-excluir-produto" data-id="' + produto.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="red" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/></svg></button>';
                        table += '</td>';
                        table += '</tr>';
                    });

                    table += '</tbody>';
                    table += '</table>';

                    $('#tabela-produtos').append(table);

                    // Evento de clique para o botão de editar produto
                    $(document).on('click', '.btn-editar-produto', function() {
                        var produtoId = $(this).data('id');
                        window.location.href = 'manipulacao/produto/updateproduto.html?id=' + produtoId;
                    });

                    // Evento de clique para o botão de excluir produto
                    $(document).on('click', '.btn-excluir-produto', function() {
                        var produtoId = $(this).data('id');
                        if (confirm('Tem certeza que deseja excluir este produto?')) {
                            $.ajax({
                                url: 'php/produto/delete_produto.php',
                                type: 'POST',
                                data: { id: produtoId },
                                success: function(response) {
                                    alert('Produto excluído com sucesso!');
                                    // Recarregar a tabela de produtos após exclusão
                                    carregarProdutos();
                                },
                                error: function(xhr, status, error) {
                                    console.error('Erro ao excluir produto:', status, error);
                                    alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
                                }
                            });
                        }
                    });
                } else {
                    $('#tabela-produtos').html('<p>Nenhum produto encontrado.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados de produtos:', status, error);
                $('#tabela-produtos').html('<p>Erro ao carregar dados de produtos. Verifique o console para mais detalhes.</p>');
            }
        });
    });
});

// Função para carregar os produtos novamente após exclusão
function carregarProdutos() {
    $.ajax({
        url: 'php/produto/get_produtos.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Dados de produtos recebidos:', data);
            $('#tabela-produtos').empty();

            if (data.length > 0) {
                var table = '<table class="table table-bordered">';
                table += '<thead style="background-color: #9c1de7; color: white;">';
                table += '<tr>';
                table += '<th>Nome</th>';
                table += '<th>Descrição Principal</th>';
                table += '<th>Descrição Secundária</th>';
                table += '<th>Valor</th>';
                table += '<th>Adicional</th>';
                table += '<th>Ações</th>';
                table += '</tr>';
                table += '</thead>';
                table += '<tbody>';

                $.each(data, function(index, produto) {
                    table += '<tr>';
                    table += '<td>' + produto.nome + '</td>';
                    table += '<td>' + produto.descricao1 + '</td>';
                    table += '<td>' + produto.descricao2 + '</td>';
                    table += '<td>' + "R$ " + produto.valor + '</td>';
                    table += '<td>' + "Adicionais: " + produto.adicional + '</td>';
                    table += '<td>';
                    table += '<button class="btn-editar-produto" data-id="' + produto.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#faee1c" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg></button> ';
                    table += '<button class="btn-excluir-produto" data-id="' + produto.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="red" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/></svg></button>';
                    table += '</td>';
                    table += '</tr>';
                });

                table += '</tbody>';
                table += '</table>';

                $('#tabela-produtos').append(table);
            } else {
                $('#tabela-produtos').html('<p>Nenhum produto encontrado.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar dados de produtos:', status, error);
            $('#tabela-produtos').html('<p>Erro ao carregar dados de produtos. Verifique o console para mais detalhes.</p>');
        }
    });
}
