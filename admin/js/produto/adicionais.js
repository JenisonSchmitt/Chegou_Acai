$(document).ready(function() {
    $('#link-adicional').on('shown.bs.tab', function(e) {
        console.log('Aba Adicional foi mostrada.');

        $.ajax({
            url: 'php/produto/get_adicionais.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Dados de adicionais recebidos:', data);

                $('#tabela-adicionais').empty();

                if (data.length > 0) {
                    var table = '<table class="table table-bordered">';
                    table += '<thead style="background-color: #9c1de7; color: white;">';
                    table += '<tr>';
                    table += '<th>Nome</th>';
                    table += '<th>Valor</th>';
                    table += '<th>Ações</th>';
                    table += '</tr>';
                    table += '</thead>';
                    table += '<tbody>';

                    $.each(data, function(index, adicionais) {
                        table += '<tr>';
                        table += '<td>' + adicionais.nome + '</td>';
                        table += '<td>' + "R$ " + adicionais.valor + '</td>';
                        table += '<td>';
                        table += '<button class="btn-editar-adicional" data-id="' + adicionais.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#581b98" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg></button> ';
                        table += '<button class="btn-excluir-adicional" data-id="' + adicionais.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="red" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/></svg></button>';
                        table += '</td>';
                        table += '</tr>';
                    });

                    table += '</tbody>';
                    table += '</table>';

                    $('#tabela-adicionais').append(table);

                    // Adiciona os manipuladores de evento para os botões de editar e excluir
                    $('.btn-editar-adicional').on('click', function() {
                        var adicionalId = $(this).data('id');
                        window.location.href = 'manipulacao/produto/updateadicional.html?id=' + adicionalId;
                    });

                    $('.btn-excluir-adicional').click(function() {
                        var id = $(this).data('id');
                        if (confirm('Tem certeza que deseja excluir este adicional?')) {
                            $.ajax({
                                url: 'php/produto/delete_adicional.php',
                                type: 'POST',
                                data: { id: id },
                                success: function(response) {
                                    var result = JSON.parse(response);
                                    if (result.success) {
                                        alert(result.message);
                                        // Recarrega a aba para atualizar a lista de adicionais
                                        $('#link-adicional').trigger('shown.bs.tab');
                                    } else {
                                        alert(result.message);
                                    }
                                },
                                error: function(xhr, status, error) {
                                    console.error('Erro ao excluir adicional:', status, error);
                                    alert('Erro ao excluir adicional: ' + status);
                                }
                            });
                        }
                    });
                } else {
                    $('#tabela-adicionais').html('<p>Nenhum adicional encontrado.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados de adicionais:', status, error);
                $('#tabela-adicionais').html('<p>Erro ao carregar dados de adicionais. Verifique o console para mais detalhes.</p>');
            }
        });
    });
});
