document.addEventListener('DOMContentLoaded', function() {
  // Elementos da página
  const navLinks = document.querySelectorAll('.nav-links a');
  const conteudo = document.getElementById('conteudo-dinamico');
  
  // Todas as seções disponíveis
  const secoes = {
    'inicio': `
      <section class="hero">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Bem-vindo, Paciente!</h1>
            <p>Gerencie suas informações, consulte arquivos enviados e agende suas consultas.</p>
          </div>
          <div class="hero-image">
            <img src="https://img.freepik.com/fotos-gratis/medico-de-tiro-medio-mostrando-resultados-para-o-paciente_23-2148302133.jpg" alt="Área do Paciente">
          </div>
        </div>
      </section>
    `,
    'minha-conta': `
      <section class="account-section">
        <div class="container account-wrapper">
          <div class="account-container">
            <h2>Minha Conta</h2>
            <p>Atualize suas informações pessoais</p>

            <form id="accountForm" class="account-form">
              <div class="form-group">
                <label for="accountNome">Nome completo</label>
                <input type="text" id="accountNome" name="nome" required placeholder="Seu nome completo">
              </div>

              <div class="form-group">
                <label for="accountEmail">E-mail</label>
                <input type="email" id="accountEmail" name="email" required placeholder="seu@email.com" readonly>
              </div>

              <div class="form-group">
                <label for="accountTelefone">Telefone</label>
                <input type="tel" id="accountTelefone" name="telefone" required placeholder="(11) 99999-9999">
              </div>

              <div class="form-group">
                <label for="accountDataNascimento">Data de Nascimento</label>
                <input type="date" id="accountDataNascimento" name="dataNascimento" required>
              </div>

              <div class="form-group">
                <label for="accountSenhaAtual">Senha atual (para alterações)</label>
                <input type="password" id="accountSenhaAtual" name="senhaAtual" placeholder="Digite sua senha atual">
              </div>

              <div class="form-group">
                <label for="accountNovaSenha">Nova senha</label>
                <input type="password" id="accountNovaSenha" name="novaSenha" placeholder="Digite a nova senha">
              </div>

              <div class="form-group">
                <label for="accountConfirmarSenha">Confirmar nova senha</label>
                <input type="password" id="accountConfirmarSenha" name="confirmarSenha" placeholder="Confirme a nova senha">
              </div>

              <button type="submit" class="btn-login-submit">Salvar Alterações</button>

              <div class="account-actions">
                <button type="button" class="btn-delete-account" id="deleteAccount">Excluir minha conta</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `,
    'arquivos': `
      <section class="services">
        <div class="container">
          <h2>Arquivos Recebidos</h2>
          <ul>
            <li><a href="#">Plano Alimentar - Março.pdf</a></li>
            <li><a href="#">Receitas Saudáveis.pdf</a></li>
            <li><a href="#">Requisição de Exames.pdf</a></li>
          </ul>
        </div>
      </section>
    `,
    'consultas': `
      <section class="contact">
        <div class="container">
          <h2>Consultas</h2>
          <p>Agende ou desmarque suas consultas com facilidade.</p>
          <a href="agendar-consulta.html" class="btn">Agendar Consulta</a>
          <a href="desmarcar-consulta.html" class="btn" style="background-color: #e53935;">Desmarcar Consulta</a>
        </div>
      </section>
    `
  };

  // Função para carregar e mostrar uma seção
  function carregarSecao(secao) {
    // Atualiza o conteúdo
    conteudo.innerHTML = secoes[secao];
    
    // Atualiza a classe active nos links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === secao) {
        link.classList.add('active');
      }
    });
    
    // Salva no localStorage
    localStorage.setItem('secaoAtiva', secao);

    // Se for a seção de Minha Conta, carrega os dados do usuário
    if (secao === 'minha-conta') {
      carregarDadosUsuario();
      configurarMascaraTelefone();
    }
  }

  // Carrega os dados do usuário do Firebase
  function carregarDadosUsuario() {
    const user = firebase.auth().currentUser;
    
    if (user) {
      // Carrega dados adicionais do Firestore
      firebase.firestore().collection('usuarios').doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            
            // Preenche os campos do formulário
            document.getElementById('accountNome').value = user.displayName || userData.nome || '';
            document.getElementById('accountEmail').value = user.email || '';
            document.getElementById('accountTelefone').value = userData.telefone || '';
            document.getElementById('accountDataNascimento').value = userData.dataNascimento || '';
          }
        })
        .catch(error => {
          console.error('Erro ao carregar dados do usuário:', error);
        });
    }
  }

  // Configura máscara de telefone para o campo da conta
  function configurarMascaraTelefone() {
    const telefoneInput = document.getElementById('accountTelefone');
    
    if (telefoneInput) {
      telefoneInput.addEventListener('input', function(e) {
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
    }
  }

  // Verifica se há uma seção ativa salva
  const secaoSalva = localStorage.getItem('secaoAtiva');
  
  // Carrega a seção salva ou a página inicial por padrão
  if (secaoSalva && secoes[secaoSalva]) {
    carregarSecao(secaoSalva);
  } else {
    carregarSecao('inicio');
  }

  // Adiciona os event listeners para os links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const secao = this.getAttribute('data-section');
      carregarSecao(secao);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Event listener para o formulário de conta
  document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'accountForm') {
      e.preventDefault();
      
      const user = firebase.auth().currentUser;
      if (!user) {
        alert('Você precisa estar logado para atualizar seus dados.');
        return;
      }

      const nome = document.getElementById('accountNome').value.trim();
      const telefone = document.getElementById('accountTelefone').value.trim();
      const dataNascimento = document.getElementById('accountDataNascimento').value;
      const senhaAtual = document.getElementById('accountSenhaAtual').value;
      const novaSenha = document.getElementById('accountNovaSenha').value;
      const confirmarSenha = document.getElementById('accountConfirmarSenha').value;
      
      // Validações
      if (novaSenha && novaSenha !== confirmarSenha) {
        alert('As novas senhas não coincidem.');
        return;
      }

      // Atualiza os dados no Firestore
      const userRef = firebase.firestore().collection('usuarios').doc(user.uid);
      
      userRef.update({
        nome: nome,
        telefone: telefone,
        dataNascimento: dataNascimento
      })
      .then(() => {
        // Atualiza o nome de exibição no Auth
        return user.updateProfile({
          displayName: nome
        });
      })
      .then(() => {
        // Se houver nova senha, atualiza a senha
        if (novaSenha && senhaAtual) {
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            senhaAtual
          );
          
          return user.reauthenticateWithCredential(credential)
            .then(() => {
              return user.updatePassword(novaSenha);
            });
        }
      })
      .then(() => {
        alert('Alterações salvas com sucesso!');
        carregarSecao('minha-conta'); // Recarrega os dados
      })
      .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao salvar alterações: ' + error.message);
      });
    }
  });

  // Event listener para o botão de excluir conta
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'deleteAccount') {
      if (confirm('Tem certeza que deseja excluir sua conta? Todos os seus dados serão permanentemente removidos e esta ação não pode ser desfeita.')) {
        const user = firebase.auth().currentUser;
        
        if (user) {
          // Primeiro remove os dados do Firestore
          firebase.firestore().collection('usuarios').doc(user.uid).delete()
            .then(() => {
              // Depois remove a conta do Auth
              return user.delete();
            })
            .then(() => {
              alert('Conta excluída com sucesso.');
              window.location.href = 'index.html'; // Redireciona para a página inicial
            })
            .catch(error => {
              console.error('Erro ao excluir conta:', error);
              alert('Erro ao excluir conta: ' + error.message);
            });
        }
      }
    }
  });

  // Botão de voltar ao topo
  const backToTopButton = document.createElement('button');
  backToTopButton.innerText = '↑';
  backToTopButton.id = 'backToTop';
  backToTopButton.style.position = 'fixed';
  backToTopButton.style.bottom = '120px';
  backToTopButton.style.right = '40px';
  backToTopButton.style.padding = '10px 15px';
  backToTopButton.style.fontSize = '20px';
  backToTopButton.style.border = 'none';
  backToTopButton.style.borderRadius = '50%';
  backToTopButton.style.backgroundColor = '#4CAF50';
  backToTopButton.style.color = '#fff';
  backToTopButton.style.cursor = 'pointer';
  backToTopButton.style.display = 'none';
  backToTopButton.style.zIndex = '1000';
  document.body.appendChild(backToTopButton);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});