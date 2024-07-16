$(document).ready(function() {
    $('#link-cliente').on('shown.bs.tab', function(e) {
        console.log('Aba Cliente foi mostrada.');

        $.ajax({
            url: 'php/cliente/get_clientes.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Dados de Clientes recebidos:', data);

                $('#tabela-clientes').empty();

                if (data.length > 0) {
                    var table = '<table class="table table-bordered">';
                    table += '<thead style="background-color: #9c1de7; color: white;">';
                    table += '<tr>';
                    table += '<th>Nome</th>';
                    table += '<th>Telefone</th>';
                    table += '<th>E-mail</th>';
                    table += '<th>Endereço</th>';
                    table += '<th>Ações</th>';
                    table += '</tr>';
                    table += '</thead>';
                    table += '<tbody>';

                    $.each(data, function(index, cliente) {
                        table += '<tr>';
                        table += '<td>' + cliente.nome + '</td>';
                        table += '<td>' + cliente.telefone + '</td>';
                        table += '<td>' + cliente.email + '</td>';
                        table += '<td>' + "Rua: " + cliente.endereco + " - Número: " + cliente.numero + " - Complemento:" + cliente.complemento 
                        + " - Bairro: " + cliente.bairro + " - Cidade: " + cliente.cidade + " - CEP: " + cliente.cep + '</td>';
                        table += '<td>';
                        table += '<button class="btn-editar-cliente" data-id="' + cliente.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#581b98" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg></button> ';
                        table += '<button class="btn-excluir-cliente" data-id="' + cliente.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="red" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/></svg></button>';
                        table += '</td>';
                        table += '</tr>';
                    });

                    table += '</tbody>';
                    table += '</table>';

                    $('#tabela-clientes').append(table);

                    // Adicionando eventos para os botões
                    $('.btn-editar-cliente').on('click', function() {
                        var clienteId = $(this).data('id');
                        window.location.href = 'manipulacao/cliente/updatecliente.html?id=' + clienteId;
                    });

                    $('.btn-excluir-cliente').on('click', function() {
                        var clienteId = $(this).data('id');
                        if (confirm('Tem certeza que deseja excluir este cliente?')) {
                            $.ajax({
                                url: 'php/cliente/delete_cliente.php',
                                type: 'POST',
                                data: { id: clienteId },
                                success: function(response) {
                                    alert('Cliente excluído com sucesso!');
                                    // Recarrega a aba "Clientes"
                                    $('#link-cliente').removeClass('active').tab('show');
                                },
                                error: function(xhr, status, error) {
                                    console.error('Erro ao excluir cliente:', status, error);
                                    alert('Erro ao excluir cliente. Verifique o console para mais detalhes.');
                                }
                            });
                        }
                    });
                } else {
                    $('#tabela-clientes').html('<p>Nenhum cliente encontrado.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados de cliente:', status, error);
                $('#tabela-clientes').html('<p>Erro ao carregar dados de cliente. Verifique o console para mais detalhes.</p>');
            }
        });
    });
});
