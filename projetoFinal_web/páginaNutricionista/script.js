document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const conteudo = document.getElementById('conteudo-dinamico');

    const secoes = {
        'inicio': `
            <section class="hero">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Bem-vinda, Dra. Marina!</h1>
                        <p>Acesse os dados dos seus pacientes, gerencie sua agenda e envie arquivos.</p>
                    </div>
                    <div class="hero-image">
                        <img src="https://cdn2.hubspot.net/hubfs/2961792/nutricionista.jpg" alt="Área da Nutricionista">
                    </div>
                </div>
            </section>
        `,
        'pacientes': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <h2>Gerenciar Pacientes</h2>
                        <div class="search-box">
                            <input type="text" id="searchPatient" placeholder="Buscar paciente por nome ou e-mail">
                        </div>
                        <div class="patient-list" id="patientList"></div>
                        <div id="patientDetails" style="display: none;">
                            <div class="divisao-consultas">
                                <hr class="linha-divisoria">
                                <h2 class="titulo-consultas-agendadas">Prontuário do Paciente</h2>
                            </div>
                            <div id="patientInfo"></div>
                            <div class="file-upload-container">
                                <h3>Enviar Arquivo</h3>
                                <div class="file-upload-box" id="fileDropArea">
                                    <p>Arraste arquivos aqui ou clique para selecionar</p>
                                    <input type="file" id="fileInput" style="display: none;">
                                </div>
                                <button id="btnSendFile" class="btn-login-submit">Enviar Arquivo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        'agenda': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <div class="divisao-consultas">
                            <h2 class="titulo-consultas-agendadas">Consultas Agendadas</h2>
                            <div class="agenda-container" id="agendaContainer"></div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        'agendar-consulta': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <h2>Agendar Nova Consulta</h2>
                        <p>Preencha os dados para agendar uma nova consulta</p>
                        <form id="agendarConsultaForm" class="account-form">
                            <div class="form-group">
                                <label for="pesquisaPaciente">Paciente</label>
                                <input type="text" id="pesquisaPaciente" placeholder="Digite o nome do paciente" required>
                                <div id="resultadosPaciente" class="resultados-busca"></div>
                                <input type="hidden" id="pacienteId" name="pacienteId">
                            </div>
                            <div class="form-group">
                                <label for="dataConsultaNutri">Data da Consulta</label>
                                <input type="date" id="dataConsultaNutri" required>
                            </div>
                            <div class="form-group">
                                <label for="horarioConsultaNutri">Horário</label>
                                <select id="horarioConsultaNutri" required>
                                    <option value="">Selecione um horário</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-login-submit">Agendar Consulta</button>
                        </form>
                    </div>
                </div>
            </section>
        `,
        'minha-conta': `
            <section class="account-section">
                <div class="container">
                    <div class="account-container">
                        <h2>Minha Conta</h2>
                        <p>Atualize suas informações de acesso</p>
                        <form id="nutriAccountForm" class="account-form">
                            <div class="form-group">
                                <label for="nutriEmail">E-mail</label>
                                <input type="email" id="nutriEmail" placeholder="emailExemplo@gmail.com" required>
                            </div>
                            <div class="form-group">
                                <label for="currentPasswordNutri">Senha Atual</label>
                                <input type="password" id="currentPasswordNutri" placeholder="Digite sua senha atual">
                            </div>
                            <div class="form-group">
                                <label for="newPasswordNutri">Nova Senha</label>
                                <input type="password" id="newPasswordNutri" placeholder="Digite a nova senha (minimo 6 caracteres)">
                            </div>
                            <div class="form-group">
                                <label for="confirmPasswordNutri">Confirmar Nova Senha</label>
                                <input type="password" id="confirmPasswordNutri" placeholder="Confirme a nova senha">
                            </div>
                            <button type="submit" class="btn-login-submit">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            </section>
        `
    };

    // Função para formatar data no padrão dd/mm/yyyy
    function formatarDataBrasileira(dataString) {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function validarDiaUtil(inputData, horarioSelect) {
        const dataSelecionada = new Date(inputData.value);
        const diaSemana = dataSelecionada.getDay();
        if (diaSemana === 0 || diaSemana === 6) {
            alert('Consultas apenas de segunda a sexta-feira');
            inputData.value = '';
            if (horarioSelect) {
                horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
            }
            return false;
        }
        return true;
    }

    function carregarSecao(secao) {
        conteudo.innerHTML = secoes[secao] || secoes['inicio'];
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === secao);
        });

        localStorage.setItem('secaoAtivaNutri', secao);

        if (secao === 'pacientes') carregarPacientes();
        if (secao === 'agenda') carregarAgenda();
        if (secao === 'agendar-consulta') carregarFormularioAgendamento();
        if (secao === 'minha-conta') carregarDadosNutricionista();
    }

    function carregarFormularioAgendamento() {
        const inputPesquisa = document.getElementById('pesquisaPaciente');
        const resultadosDiv = document.getElementById('resultadosPaciente');
        const pacienteIdInput = document.getElementById('pacienteId');

        inputPesquisa.value = "";
        pacienteIdInput.value = "";
        resultadosDiv.innerHTML = "";

        inputPesquisa.addEventListener('input', function() {
            const termo = this.value.trim();
            if (termo.length < 2) {
                resultadosDiv.style.display = 'none';
                return;
            }
            
            resultadosDiv.style.display = 'block';
        });

        document.addEventListener('click', function(e) {
            if (!resultadosDiv.contains(e.target) && e.target !== inputPesquisa) {
                resultadosDiv.style.display = 'none';
            }
        });

        const inputData = document.getElementById('dataConsultaNutri');
        const horarioSelect = document.getElementById('horarioConsultaNutri');

        inputData.min = new Date().toISOString().split('T')[0];

        inputData.addEventListener('input', function() {
            if (!validarDiaUtil(inputData, horarioSelect)) return;

            horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';

            for (let h = 11; h <= 17; h++) {
                ['00', '30'].forEach(m => {
                    horarioSelect.innerHTML += `<option value="${h}:${m}">${h}:${m}</option>`;
                });
            }
            horarioSelect.innerHTML += '<option value="18:00">18:00</option>';
        });

        document.getElementById('agendarConsultaForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pacienteId = pacienteIdInput.value;
            const pacienteNome = inputPesquisa.value;
            const data = inputData.value;
            const horario = horarioSelect.value;
            
            if (!pacienteNome || !data || !horario) {
                showMessage('Preencha todos os campos', 'error');
                return;
            }
            
            if (horario === "") {
                showMessage('Selecione um horário válido', 'error');
                return;
            }
            
            const hora = parseInt(horario.split(':')[0]);
            if (hora < 11 || hora > 18) {
                showMessage('Horário inválido. Agende entre 11h e 18h', 'error');
                return;
            }
            
            // Formata a data para exibição no padrão brasileiro
            const dataFormatada = formatarDataBrasileira(data);
            showMessage(`Consulta agendada para ${pacienteNome} no dia ${dataFormatada} às ${horario}`, 'success');
            
            this.reset();
            pacienteIdInput.value = "";
            horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
            carregarAgenda();
        });
    }

    function carregarPacientes() {
        const patientList = document.getElementById('patientList');
        patientList.innerHTML = '<p>Carregando pacientes...</p>';
    }

    function mostrarDetalhesPaciente(pacienteId, paciente) {
        document.getElementById('patientList').style.display = 'none';
        const patientDetails = document.getElementById('patientDetails');
        const patientInfo = document.getElementById('patientInfo');

        // Formata a data de nascimento para o padrão brasileiro, se existir
        const dataNascimentoFormatada = paciente.dataNascimento ? 
            formatarDataBrasileira(paciente.dataNascimento) : '';

        patientInfo.innerHTML = `
            <div class="form-group">
                <label>Nome completo</label>
                <input type="text" value="${paciente.nome || ''}" readonly>
            </div>
            <div class="form-group">
                <label>E-mail</label>
                <input type="email" value="${paciente.email || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Telefone</label>
                <input type="tel" value="${paciente.telefone || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Data de Nascimento</label>
                <input type="text" value="${dataNascimentoFormatada}" readonly>
            </div>
        `;

        const fileInput = document.getElementById('fileInput');
        const fileDropArea = document.getElementById('fileDropArea');

        fileDropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);

        fileDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropArea.style.borderColor = '#1fab55';
        });

        fileDropArea.addEventListener('dragleave', () => {
            fileDropArea.style.borderColor = '#ddd';
        });

        fileDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropArea.style.borderColor = '#ddd';
            fileInput.files = e.dataTransfer.files;
        });

        document.getElementById('btnSendFile').addEventListener('click', () => {
            if (fileInput.files.length > 0) {
                enviarArquivo(pacienteId, fileInput.files[0]);
            } else {
                alert('Selecione um arquivo para enviar');
            }
        });
        
        patientDetails.style.display = 'block';
    }

    function enviarArquivo(pacienteId, file) {
        alert(`Arquivo "${file.name}" enviado para o paciente ${pacienteId} (Funcionalidade completa será implementada)`);
    }

    function carregarAgenda() {
        const agendaContainer = document.getElementById('agendaContainer');
        agendaContainer.innerHTML = '<p>Carregando consultas agendadas...</p>';
    }

    function carregarDadosNutricionista() {
        document.getElementById('nutriEmail').value = '';
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            carregarSecao(link.getAttribute('data-section'));
        });
    });

    carregarSecao(localStorage.getItem('secaoAtivaNutri') || 'inicio');

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        const container = document.querySelector('.account-container') || document.querySelector('.container');
        container.prepend(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    function handleFileSelect(event) {
        console.log('Arquivo selecionado:', event.target.files[0]);
    }
});