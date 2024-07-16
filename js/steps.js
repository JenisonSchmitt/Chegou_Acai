function nextStep(currentStep, nextStepId) {
    document.getElementById('step' + currentStep).style.display = 'none';
    document.getElementById(nextStepId).style.display = 'block';
    document.getElementById(nextStepId).scrollIntoView({ behavior: 'smooth' }); // Rola suavemente para o próximo step
}

function previousStep(previousStep, previousStepId) {
    document.getElementById('step' + previousStep).style.display = 'none';
    document.getElementById(previousStepId).style.display = 'block';
    document.getElementById(previousStepId).scrollIntoView({ behavior: 'smooth' }); // Rola suavemente para o step anterior
}

// Inicializa o primeiro step
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('step1').style.display = 'block';
});
