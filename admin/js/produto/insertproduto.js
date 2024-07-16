$(document).ready(function() {
    // Formatar o campo 'valor' como valor monetário
    $('#valor').on('input', function() {
        var inputVal = $(this).val().replace(/[^0-9,]/g, ''); // Remove caracteres não numéricos exceto vírgula
        var parts = inputVal.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, '.'); // Adiciona ponto a cada 2 dígitos
        $(this).val(parts.join(','));
    });

    // Aceitar apenas números no campo 'adicional'
    $('#adicional').on('input', function() {
        $(this).val($(this).val().replace(/[^\d]/, '')); // Remove caracteres não numéricos
    });
});