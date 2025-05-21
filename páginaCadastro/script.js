document.addEventListener('DOMContentLoaded', function () {
  // Firestore
  const db = firebase.firestore();

  const form = document.getElementById('cadastroForm');
  const telefoneInput = document.getElementById('telefone');

  // Máscara de telefone
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = telefoneInput.value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;
    const captchaInput = document.getElementById('captchaInput').value.trim();

    const telefoneNumerico = telefone.replace(/\D/g, '');

    // Validação do telefone
    if (telefoneNumerico.length !== 11) {
      alert('O telefone deve conter exatamente 11 números (incluindo DDD).');
      return;
    }

    // Validação da senha
    if (senha !== confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    // Validação do CAPTCHA
    if (captchaInput !== currentCaptcha) {
      alert('Código de verificação incorreto.');
      currentCaptcha = generateCaptcha();
      captchaText.textContent = currentCaptcha;
      document.getElementById('captchaInput').value = '';
      return;
    }

    // Validação da data de nascimento
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

    // Cadastro no Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: nome }).then(() => user);
      })
      .then((user) => {
        // Salva dados adicionais no Firestore
        return db.collection('usuarios').doc(user.uid).set({
          nome: nome,
          email: email,
          telefone: telefone,
          dataNascimento: dataNascimento,
          dataCadastro: new Date().toISOString(),
          tipo: 'paciente'
        });
      })
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        alert('Erro: ' + error.message);
      });
  });

  // CAPTCHA
  function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
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
});