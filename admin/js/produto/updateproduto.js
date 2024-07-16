$(document).ready(function() {
    // Função para obter o valor do parâmetro 'id' da URL
    function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Obter o ID do produto da URL
    var produtoId = getParameterByName('id');
    $('#produtoId').val(produtoId);

    // Requisição AJAX para buscar as informações do produto
    if (produtoId) {
        $.ajax({
            url: '../../php/produto/buscar_1produto.php',
            type: 'GET',
            data: { id: produtoId },
            dataType: 'json',
            success: function(data) {
                if (data) {
                    $('#nome').val(data.nome);
                    $('#desc1').val(data.descricao1);
                    $('#desc2').val(data.descricao2);
                    $('#valor').val(data.valor);
                    $('#adicional').val(data.adicional);
                } else {
                    alert('Produto não encontrado.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar produto:', status, error);
                alert('Erro ao buscar produto. Verifique o console para mais detalhes.');
            }
        });
    }

    // Formatar campo 'valor' como valor monetário
    $('#valor').on('input', function() {
        var inputVal = $(this).val().replace(/[^0-9,]/g, ''); // Remove caracteres não numéricos exceto vírgula
        var parts = inputVal.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, '.'); // Adiciona ponto a cada 2 dígitos
        $(this).val(parts.join(','));
    });

    // Permitir apenas números no campo 'adicional'
    $('#adicional').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
    });
});