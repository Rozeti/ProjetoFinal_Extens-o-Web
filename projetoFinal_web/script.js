// Animação suave ao rolar para seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Botão de voltar ao topo
  const backToTopButton = document.createElement('button');
  backToTopButton.innerText = '↑';
  backToTopButton.id = 'backToTop';
  backToTopButton.style.position = 'fixed';
  backToTopButton.style.bottom = '200px';
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
  
  // Carrossel de Depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const carrossel = document.querySelector('.carrossel');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    const indicadoresContainer = document.querySelector('.carrossel-indicadores');
    let currentIndex = 0;
    const testimonialsPerPage = 3;
  
    // Criar indicadores
    function criarIndicadores() {
      const totalGroups = Math.ceil(testimonials.length / testimonialsPerPage);
      for (let i = 0; i < totalGroups; i++) {
        const indicador = document.createElement('div');
        indicador.classList.add('carrossel-indicador');
        if (i === 0) indicador.classList.add('active');
        indicador.addEventListener('click', () => irParaGrupo(i));
        indicadoresContainer.appendChild(indicador);
      }
    }
  
    // Atualizar carrossel
    function atualizarCarrossel() {
      testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        
        // Mostrar 3 depoimentos por vez
        if (index >= currentIndex && index < currentIndex + testimonialsPerPage) {
          testimonial.classList.add('active');
        }
      });
  
      // Atualizar indicadores
      const indicadores = document.querySelectorAll('.carrossel-indicador');
      const activeGroup = Math.floor(currentIndex / testimonialsPerPage);
      indicadores.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === activeGroup);
      });
    }
  
    // Navegar para grupo específico
    function irParaGrupo(groupIndex) {
      currentIndex = groupIndex * testimonialsPerPage;
      atualizarCarrossel();
    }
  
    // Event listeners para navegação
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - testimonialsPerPage + testimonials.length) % testimonials.length;
      atualizarCarrossel();
    });
  
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + testimonialsPerPage) % testimonials.length;
      atualizarCarrossel();
    });
  
    // Inicializar
    criarIndicadores();
    atualizarCarrossel();
  
    // Auto-rotacionar (opcional)
    setInterval(() => {
      currentIndex = (currentIndex + testimonialsPerPage) % testimonials.length;
      atualizarCarrossel();
    }, 5000);
  });