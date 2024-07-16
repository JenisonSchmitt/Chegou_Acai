function validarFormulario() {
    console.log("Validando formulário...");
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value.trim();
    var telefone = document.getElementById("telefone").value.trim();
    var senha = document.getElementById("senha").value;
    var senha_confirm = document.getElementById("senha_confirm").value;

    var isValid = true;

    // Verifica se o nome está vazio
    if (nome.trim() === "") {
        document.getElementById("nome_error").innerHTML = "Por favor, informe seu nome.";
        isValid = false;
    } else {
        document.getElementById("nome_error").innerHTML = "";
    }

    // Verifica se o email está vazio
    if (email === "") {
        document.getElementById("email_error").innerHTML = "Por favor, informe seu email.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("email_error").innerHTML = "Por favor, informe um email válido.";
        isValid = false;
    } else {
        document.getElementById("email_error").innerHTML = "";
    }

    // Verifica se o telefone está vazio
    if (telefone === "") {
        document.getElementById("telefone_error").innerHTML = "Por favor, informe seu telefone.";
        isValid = false;
    } else if (telefone.length < 14) {
        document.getElementById("telefone_error").innerHTML = "Por favor, informe um telefone válido.";
        isValid = false;
    } else {
        document.getElementById("telefone_error").innerHTML = "";
    }

    // Verifica se a senha tem pelo menos 8 caracteres
    if (senha.length < 8) {
        document.getElementById("senha_error").innerHTML = "A senha deve ter pelo menos 8 caracteres.";
        isValid = false;
    } else {
        document.getElementById("senha_error").innerHTML = "";
    }

    // Verifica se a senha confirmada é igual à senha
    if (senha !== senha_confirm) {
        document.getElementById("senha_confirm_error").innerHTML = "As senhas não coincidem.";
        isValid = false;
    } else {
        document.getElementById("senha_confirm_error").innerHTML = "";
    }

    // Retorna o resultado da validação
    return isValid;
}


function formatarTelefone(campo) {
    var valor = campo.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    campo.value = valor;
}

function validarSenha() {
    var senha = document.getElementById("senha").value;
    var confirmarSenha = document.getElementById("senha_confirm").value;

    if (senha.length < 8) {
        document.getElementById("senha_error").innerHTML = "A senha deve ter pelo menos 8 caracteres.";
        return false;
    }

    if (senha !== confirmarSenha) {
        document.getElementById("senha_confirm_error").innerHTML = "As senhas não coincidem.";
        return false;
    }

    return true;
}

function formatarCEP(input) {
    // Remove tudo que não for dígito
    var cep = input.value.replace(/\D/g, '');

    // Verifica se o CEP tem mais de 5 dígitos para adicionar o hífen
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }

    // Atualiza o valor do campo com o CEP formatado
    input.value = cep;
}