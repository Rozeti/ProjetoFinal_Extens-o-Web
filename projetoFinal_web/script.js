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
  
// Carrossel de Depoimentos - Versão com Loop Contínuo Suave
document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.querySelector('.carrossel');
  const carrosselWrapper = document.querySelector('.carrossel-wrapper');
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.carrossel-btn.prev');
  const nextBtn = document.querySelector('.carrossel-btn.next');
  const indicadoresContainer = document.querySelector('.carrossel-indicadores');
  
  let currentIndex = 0;
  let visibleItems = 3;
  let isAnimating = false;
  let autoScrollInterval;
  const scrollSpeed = 300;
  let clonesAdded = false;

  // Configuração inicial
  function setupCarrossel() {
    visibleItems = window.innerWidth <= 992 ? (window.innerWidth <= 768 ? 1 : 2) : 3;
    
    const itemWidth = 100 / visibleItems;
    testimonials.forEach(item => {
      item.style.flex = `0 0 ${itemWidth}%`;
    });
    
    // Adicionar clones apenas uma vez
    if (!clonesAdded) {
      addClones();
      clonesAdded = true;
    }
    
    createIndicators();
    updateCarrossel();
    startAutoScroll();
  }

  // Adicionar clones para efeito contínuo
  function addClones() {
    const items = document.querySelectorAll('.testimonial');
    const itemsArray = Array.from(items);
    
    // Clonar itens suficientes para preencher a tela
    const clonesNeeded = Math.ceil(visibleItems * 2);
    for (let i = 0; i < clonesNeeded; i++) {
      const clone = itemsArray[i % itemsArray.length].cloneNode(true);
      clone.classList.add('clone');
      carrossel.appendChild(clone);
    }
  }

  // Atualizar posição do carrossel
  function updateCarrossel() {
    if (isAnimating) return;
    isAnimating = true;
    
    const itemWidth = 100 / visibleItems;
    const translateX = -currentIndex * itemWidth;
    
    carrossel.style.transition = 'transform 0.5s ease-in-out';
    carrossel.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar estado dos botões
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Atualizar indicadores
    updateIndicators();
    
    // Resetar animação
    setTimeout(() => {
      isAnimating = false;
      checkForLoop();
    }, 500);
  }

  // Verificar se precisa ajustar para loop contínuo
  function checkForLoop() {
    const totalOriginalItems = testimonials.length;
    const totalItems = totalOriginalItems + Math.ceil(visibleItems * 2); // Itens originais + clones
    
    // Se estiver perto do final dos clones, volta para os itens originais
    if (currentIndex >= totalOriginalItems) {
      currentIndex = currentIndex % totalOriginalItems;
      carrossel.style.transition = 'none';
      updateCarrosselPosition();
      setTimeout(() => {
        carrossel.style.transition = 'transform 0.5s ease-in-out';
      }, 50);
    }
    // Se estiver antes dos itens originais, vai para o final dos clones
    else if (currentIndex < 0) {
      currentIndex = totalOriginalItems + Math.floor(visibleItems * 1.5);
      carrossel.style.transition = 'none';
      updateCarrosselPosition();
      setTimeout(() => {
        carrossel.style.transition = 'transform 0.5s ease-in-out';
      }, 50);
    }
  }

  // Atualizar posição sem animação
  function updateCarrosselPosition() {
    const itemWidth = 100 / visibleItems;
    const translateX = -currentIndex * itemWidth;
    carrossel.style.transform = `translateX(${translateX}%)`;
  }

  // Criar indicadores
  function createIndicators() {
    indicadoresContainer.innerHTML = '';
    const totalPages = Math.ceil(testimonials.length / visibleItems);
    
    for (let i = 0; i < totalPages; i++) {
      const indicador = document.createElement('div');
      indicador.classList.add('carrossel-indicador');
      if (i === 0) indicador.classList.add('active');
      indicador.addEventListener('click', () => goToIndex(i));
      indicadoresContainer.appendChild(indicador);
    }
  }

  // Atualizar indicadores ativos
  function updateIndicators() {
    const indicators = document.querySelectorAll('.carrossel-indicador');
    const realIndex = currentIndex % testimonials.length;
    const activeIndicator = Math.floor(realIndex / visibleItems);
    
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('active', idx === activeIndicator);
    });
  }

  // Navegar para índice específico
  function goToIndex(index) {
    currentIndex = index * visibleItems;
    updateCarrossel();
  }

  // Event listeners para navegação
  prevBtn.addEventListener('click', () => {
    if (!isAnimating) {
      currentIndex--;
      updateCarrossel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!isAnimating) {
      currentIndex++;
      updateCarrossel();
    }
  });

  // Auto-scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (!isAnimating) {
        currentIndex++;
        updateCarrossel();
      }
    }, 5000);
  }

  // Pausar auto-scroll ao interagir
  carrosselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });

  carrosselWrapper.addEventListener('mouseleave', () => {
    startAutoScroll();
  });

  // Redimensionamento da tela
  window.addEventListener('resize', () => {
    const prevVisibleItems = visibleItems;
    setupCarrossel();
    
    if (visibleItems !== prevVisibleItems) {
      currentIndex = Math.min(currentIndex, testimonials.length - 1);
      updateCarrossel();
    }
  });

  // Inicialização
  setupCarrossel();
});

// FAQ Acordeão - Versão Corrigida
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerInner = item.querySelector('.faq-answer-inner');
    const toggle = item.querySelector('.faq-toggle');
    
    // Inicializa todos fechados
    answer.style.maxHeight = '0';
    toggle.textContent = '+';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = '0';
          otherItem.querySelector('.faq-toggle').textContent = '+';
        }
      });
      
      // Alterna o item atual
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answerInner.scrollHeight + 'px';
        toggle.textContent = '×';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        toggle.textContent = '+';
      }
    });
  });
});
