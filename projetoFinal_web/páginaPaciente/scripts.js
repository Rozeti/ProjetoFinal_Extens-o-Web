document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-links a');
    const conteudo = document.getElementById('conteudo-dinamico');

    const secoes = {
        'inicio': `
            <section class="hero">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Bem-vindo, Paciente!</h1>
                        <p>Gerencie suas informações, consulte arquivos enviados e agende suas consultas.</p>
                    </div>
                    <div class="hero-image">
                        <img src="https://img.freepik.com/fotos-gratis/medico-de-tiro-medio-mostrando-o-resultados-para-o-paciente_23-2148302133.jpg" alt="Área do Paciente">
                    </div>
                </div>
            </section>
        `,
        'minha-conta': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <h2>Minha Conta</h2>
                        <p>Atualize suas informações pessoais</p>
                        <form id="accountForm" class="account-form">
                            <div class="form-group">
                                <label for="accountNome">Nome completo</label>
                                <input type="text" id="accountNome" name="nome" required>
                            </div>
                            <div class="form-group">
                                <label for="accountEmail">E-mail</label>
                                <input type="email" id="accountEmail" name="email" placeholder="emailExemplo@gmail.com" readonly>
                            </div>
                            <div class="form-group">
                                <label for="accountTelefone">Telefone</label>
                                <input type="tel" id="accountTelefone" name="telefone" required>
                            </div>
                            <div class="form-group">
                                <label for="accountDataNascimento">Data de Nascimento</label>
                                <input type="date" id="accountDataNascimento" name="dataNascimento" required>
                            </div>

                            <div class="password-section">
                                <h3>Alterar Senha</h3>
                                <div class="form-group">
                                    <label for="currentPassword">Senha Atual</label>
                                    <input type="password" id="currentPassword" placeholder="Digite sua senha atual">
                                </div>
                                <div class="form-group">
                                    <label for="newPassword">Nova Senha</label>
                                    <input type="password" id="newPassword" placeholder="Digite a nova senha (mínimo 6 caracteres)">
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Confirme a Nova Senha</label>
                                    <input type="password" id="confirmPassword" placeholder="Digite novamente a nova senha">
                                </div>
                            </div>

                            <button type="submit" class="btn-login-submit">Salvar Alterações</button>
                            <div class="account-actions">
                                <button type="button" class="btn-delete-account">Excluir minha conta</button>
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
                        <li><a href="#">Plano Alimentar - Marco.pdf</a></li>
                        <li><a href="#">Receitas Saudáveis.pdf</a></li>
                        <li><a href="#">Requisição de Exames.pdf</a></li>
                    </ul>
                </div>
            </section>
        `,
        'consultas': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <h2>Agendar Consulta</h2>

                        <form id="agendamentoForm" class="account-form">
                            <div class="form-group">
                                <label for="dataConsulta">Data da Consulta</label>
                                <input type="date" id="dataConsulta" required>
                            </div>

                            <div class="form-group">
                                <label for="horarioConsulta">Horário Disponível</label>
                                <select id="horarioConsulta" required>
                                    <option value="">Selecione um horário</option>
                                </select>
                            </div>

                            <button type="submit" class="btn-login-submit">Agendar Consulta</button>
                        </form>

                        <div class="divisao-consultas">
                            <hr class="linha-divisoria">
                            <h2 class="titulo-consultas-agendadas">Consultas Agendadas</h2>
                        </div>

                        <div class="consultas-agendadas">
                            <ul id="listaConsultas"></ul>
                        </div>
                    </div>
                </div>
            </section>
        `
    };

    function carregarSecao(secao) {
        conteudo.innerHTML = secoes[secao] || secoes['inicio'];
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === secao);
        });
        localStorage.setItem('secaoAtiva', secao);

        if (secao === 'consultas') configurarAgendamento();
    }

    function configurarAgendamento() {
        const dataInput = document.getElementById('dataConsulta');
        const horarioSelect = document.getElementById('horarioConsulta');

        if (!dataInput) return;

        dataInput.min = new Date().toISOString().split('T')[0];

        dataInput.addEventListener('input', () => {
            const data = new Date(dataInput.value);
            if (data.getDay() === 0 || data.getDay() === 6) {
                alert("Consultas apenas de segunda a sexta");
                dataInput.value = '';
                horarioSelect.innerHTML = '<option value="">Selecione</option>';
                return;
            }

            horarioSelect.innerHTML = '<option value="">Selecione</option>';
            for (let h = 11; h <= 17; h++) {
                ['00', '30'].forEach(m => {
                    horarioSelect.innerHTML += `<option value="${h}:${m}">${h}:${m}</option>`;
                });
            }
            horarioSelect.innerHTML += '<option value="18:00">18:00</option>';
        });
    }

    function showMessage(message, type) {
        // Remove mensagens anteriores
        const oldMessage = document.querySelector('.message');
        if (oldMessage) oldMessage.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const form = document.getElementById('accountForm') || document.getElementById('agendamentoForm');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
        }
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    document.addEventListener('submit', function(e) {
        if (e.target.id === 'agendamentoForm') {
            e.preventDefault();
            const data = document.getElementById('dataConsulta').value;
            const horario = document.getElementById('horarioConsulta').value;

            if (!data || !horario) {
                showMessage('Preencha todos os campos', 'error');
                return;
            }

            const [ano, mes, dia] = data.split('-');
            const consultaId = 'consulta-' + Date.now();

            const consultaItem = document.createElement('li');
            consultaItem.innerHTML = `
                <div class="consulta-info">
                    <div class="consulta-data">${dia}/${mes}/${ano}</div>
                    <div class="consulta-horario">Horário: ${horario}</div>
                </div>
                <button class="btn-cancelar">Cancelar</button>
            `;

            consultaItem.querySelector('.btn-cancelar').addEventListener('click', function() {
                if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
                    consultaItem.remove();
                    showMessage('Consulta cancelada com sucesso', 'success');
                }
            });

            document.getElementById('listaConsultas').appendChild(consultaItem);
            e.target.reset();
            document.getElementById('horarioConsulta').innerHTML = '<option value="">Selecione um horário</option>';
            showMessage('Consulta agendada com sucesso!', 'success');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            carregarSecao(link.getAttribute('data-section'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    carregarSecao(localStorage.getItem('secaoAtiva') || 'inicio');
});