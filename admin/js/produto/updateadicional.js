$(document).ready(function() {
    // Função para obter o valor de um parâmetro da URL
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Obtém o ID do adicional a partir da URL
    var adicionalId = getParameterByName('id');

    if (adicionalId) {
        // Faz uma solicitação AJAX para buscar os dados do adicional
        $.ajax({
            url: '../../php/produto/buscar_1adicional.php',
            type: 'GET',
            data: { id: adicionalId },
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    // Preenche os campos do formulário com os dados recebidos
                    $('#produtoId').val(data.adicional.id);
                    $('#nome').val(data.adicional.nome);
                    $('#valor').val(data.adicional.valor);
                } else {
                    alert('Erro ao buscar os dados do adicional: ' + data.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar os dados do adicional:', status, error);
                alert('Erro ao buscar os dados do adicional.');
            }
        });
    } else {
        alert('ID do adicional não encontrado na URL.');
    }

    // Formatar campo 'valor' como valor monetário
    $('#valor').on('input', function() {
        var inputVal = $(this).val().replace(/[^0-9,]/g, ''); // Remove caracteres não numéricos exceto vírgula
        var parts = inputVal.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, '.'); // Adiciona ponto a cada 2 dígitos
        $(this).val(parts.join(','));
    });
});