document.getElementById('option1').addEventListener('click', function() {
    alert('Você escolheu a Opção 1');
});

document.getElementById('option2').addEventListener('click', function() {
    alert('Você escolheu a Opção 2');
});

document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.choice-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('pressed'));
            this.classList.add('pressed');
        });
    });
});
