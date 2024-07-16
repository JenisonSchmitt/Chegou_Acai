$(document).ready(function() {
    // Função para capturar o ID do cliente da URL
    function getClienteId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Capturar o ID do cliente
    const clienteId = getClienteId();

    if (clienteId) {
        // Fazer uma chamada AJAX para buscar os dados do cliente
        $.ajax({
            url: '../../php/cliente/buscar_1cliente.php', // URL do seu arquivo PHP para obter os dados do cliente
            type: 'GET',
            data: { id: clienteId },
            dataType: 'json',
            success: function(data) {
                // Preencher os campos do formulário com os dados recebidos
                $('#nome').val(data.nome);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                $('#endereco').val(data.endereco);
                $('#numero').val(data.numero);
                $('#complemento').val(data.complemento);
                $('#bairro').val(data.bairro);
                $('#cidade').val(data.cidade);
                $('#cep').val(data.cep);

                // Definir o valor do campo hidden para o ID do cliente
                $('#clienteId').val(clienteId);
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar dados do cliente:', status, error);
                alert('Erro ao carregar dados do cliente. Verifique o console para mais detalhes.');
            }
        });
    }
});