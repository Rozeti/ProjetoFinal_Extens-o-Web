document.addEventListener('DOMContentLoaded', function () {
    // Função para gerar CAPTCHA
    function generateCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    // Elementos do CAPTCHA
    const captchaText = document.getElementById('captchaText');
    const refreshBtn = document.getElementById('refreshCaptcha');
    let currentCaptcha = generateCaptcha();
    captchaText.textContent = currentCaptcha;

    // Atualizar CAPTCHA
    refreshBtn.addEventListener('click', function () {
        currentCaptcha = generateCaptcha();
        captchaText.textContent = currentCaptcha;
    });

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function (e) {
        let input = e.target.value;
        input = input.replace(/\D/g, ''); // remove tudo que não for número
        if (input.length > 0) {
            input = '(' + input;
        }
        if (input.length > 3) {
            input = input.slice(0, 3) + ') ' + input.slice(3);
        }
        if (input.length > 10) {
            input = input.slice(0, 10) + '-' + input.slice(10, 15);
        }
        e.target.value = input;
    });

    // Validação do formulário
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = telefoneInput.value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const captchaInput = document.getElementById('captchaInput').value.trim();
        const telefoneNumerico = telefone.replace(/\D/g, '');

        // Validações
        if (telefoneNumerico.length !== 11) {
            alert('O telefone deve conter exatamente 11 números (incluindo DDD).');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        if (captchaInput !== currentCaptcha) {
            alert('Código de verificação incorreto.');
            currentCaptcha = generateCaptcha();
            captchaText.textContent = currentCaptcha;
            document.getElementById('captchaInput').value = '';
            return;
        }

        if (!dataNascimento) {
            alert('Por favor, informe sua data de nascimento.');
            return;
        }

        // Calcular idade mínima (18 anos)
        const dataNasc = new Date(dataNascimento);
        const hoje = new Date();
        const idadeMinima = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

        if (dataNasc > idadeMinima) {
            alert('Você deve ter pelo menos 18 anos para se cadastrar.');
            return;
        }

        // Se todas as validações passarem
        alert('Cadastro validado com sucesso! (Integração com Firebase será implementada posteriormente)');
        
        // Limpar formulário
        form.reset();
        currentCaptcha = generateCaptcha();
        captchaText.textContent = currentCaptcha;
    });
});