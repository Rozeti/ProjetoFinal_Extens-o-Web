document.addEventListener('DOMContentLoaded', function () {
    function generateCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = "";
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    const captchaText = document.getElementById('captchaText');
    const refreshBtn = document.getElementById('refreshCaptcha');

    let currentCaptcha = generateCaptcha();
    captchaText.textContent = currentCaptcha;

    refreshBtn.addEventListener('click', function () {
        currentCaptcha = generateCaptcha();
        captchaText.textContent = currentCaptcha;
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const captchaInput = document.getElementById('captchaInput').value;
        if (captchaInput !== currentCaptcha) {
            alert('Código de verificação incorreto. Por favor, tente novamente.');
            currentCaptcha = generateCaptcha();
            captchaText.textContent = currentCaptcha;
            document.getElementById('captchaInput').value = "";
            return;
        }

        alert('Login realizado com sucesso! Redirecionando...');
        // window.location.href = 'dashboard.html';
    });
});