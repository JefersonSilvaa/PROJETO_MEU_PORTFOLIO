// ===============================
// CONFIGURAÇÕES GLOBAIS
// ===============================
const CONFIG = {
  phoneNumber: '5581993192454', // WhatsApp DDI+DDD+NUM
};

// ===============================
// UTILITÁRIOS
// ===============================

/**
 * Cria URL do WhatsApp com mensagem pré-preenchida
 * @param {string} text - Texto da mensagem
 * @returns {string} URL do WhatsApp
 */
function makeWhatsUrl(text) {
  return `https://wa.me/${CONFIG.phoneNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Abre URL em nova aba
 * @param {string} url - URL a abrir
 */
function openInNewTab(url) {
  window.open(url, '_blank');
}

// ===============================
// INICIALIZAÇÃO DO AOS
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true });
  }
});

// ===============================
// EVENT LISTENERS - WHATSAPP BUTTONS
// ===============================

// CTA Principal (Hero Section)
const ctaWppBtn = document.getElementById('cta-wpp');
if (ctaWppBtn) {
  ctaWppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = 'Olá! Gostaria de um orçamento para suporte técnico. Pode me ajudar?';
    openInNewTab(makeWhatsUrl(msg));
  });
}

// Botão WhatsApp Flutuante
const floatingWppBtn = document.getElementById('floating-wpp');
if (floatingWppBtn) {
  floatingWppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = 'Olá! Gostaria de um orçamento. Meu nome é: ';
    openInNewTab(makeWhatsUrl(msg));
  });
}

// Botão WhatsApp da NavBar (Desktop)
const topWppBtn = document.getElementById('top-wpp');
if (topWppBtn) {
  topWppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInNewTab(makeWhatsUrl('Olá! Quero um orçamento.'));
  });
}

// Botão WhatsApp do Menu Mobile
const mobileWppBtn = document.getElementById('mobile-wpp');
if (mobileWppBtn) {
  mobileWppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInNewTab(makeWhatsUrl('Olá! Quero um orçamento.'));
  });
}

// ===============================
// EVENT LISTENERS - SERVIÇOS
// ===============================

/**
 * Listeners para os botões de serviços
 */
document.querySelectorAll('.open-wpp').forEach((btn) => {
  btn.addEventListener('click', () => {
    const service = btn.dataset.service || 'serviço';
    const msg = `Olá! Me chamo {NOME}. Moro em {CIDADE}. Preciso de ajuda com ${service}. Pode me informar preço e disponibilidade?`;
    openInNewTab(makeWhatsUrl(msg));
  });
});

// ===============================
// EVENT LISTENERS - FORMULÁRIO
// ===============================

// Enviar Formulário para WhatsApp
const sendFormBtn = document.getElementById('send-whatsapp');
if (sendFormBtn) {
  sendFormBtn.addEventListener('click', () => {
    const nome = document.getElementById('nome')?.value || '{NOME}';
    const cidade = document.getElementById('cidade')?.value || '{CIDADE}';
    const mensagem = document.getElementById('mensagem')?.value || 'Preciso de ajuda com meu computador';
    const text = `Olá! Me chamo ${nome} e moro em ${cidade}. ${mensagem}`;
    openInNewTab(makeWhatsUrl(text));
  });
}

// Limpar Formulário
const clearFormBtn = document.getElementById('clear-form');
if (clearFormBtn) {
  clearFormBtn.addEventListener('click', () => {
    document.getElementById('nome').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('mensagem').value = '';
  });
}

// ===============================
// EVENT LISTENERS - MENU MOBILE
// ===============================

const btnMobileMenu = document.getElementById('btn-mobile');
const mobileMenuWrapper = document.getElementById('mobile-menu');

if (btnMobileMenu && mobileMenuWrapper) {
  // Toggle menu ao clicar no botão
  btnMobileMenu.addEventListener('click', () => {
    mobileMenuWrapper.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenuWrapper.classList.remove('active');
    });
  });
}

// ===============================
// EVENT LISTENERS - TODOS OS PROJETOS
// ===============================

const allProjectsToggleBtn = document.getElementById('all-projects-toggle');
const allProjectsSection = document.getElementById('all-projects');

if (allProjectsToggleBtn && allProjectsSection) {
  allProjectsToggleBtn.addEventListener('click', () => {
    const isHidden = allProjectsSection.hasAttribute('hidden');

    if (isHidden) {
      allProjectsSection.removeAttribute('hidden');
      allProjectsToggleBtn.setAttribute('aria-expanded', 'true');
      allProjectsToggleBtn.innerHTML = '<i class="bi bi-grid-1x2-fill btn__icon" aria-hidden="true"></i>Ocultar projetos';
      allProjectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    allProjectsSection.setAttribute('hidden', '');
    allProjectsToggleBtn.setAttribute('aria-expanded', 'false');
    allProjectsToggleBtn.innerHTML = '<i class="bi bi-grid-1x2-fill btn__icon" aria-hidden="true"></i>Mostrar todos os projetos';
  });
}

// ===============================
// CARROSSEL DE PROJETOS - SETAS
// ===============================

(function () {
  const carousel = document.getElementById('projects-carousel');
  const btnPrev = document.getElementById('proj-prev');
  const btnNext = document.getElementById('proj-next');

  if (!carousel || !btnPrev || !btnNext) return;

  const slideWidth = () => carousel.clientWidth * 0.9;

  function updateArrows() {
    const atStart = carousel.scrollLeft <= 8;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
    btnPrev.classList.toggle('is-hidden', atStart);
    btnNext.classList.toggle('is-hidden', atEnd);
  }

  btnPrev.addEventListener('click', () => {
    carousel.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
  });

  btnNext.addEventListener('click', () => {
    carousel.scrollBy({ left: slideWidth(), behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  // Estado inicial
  updateArrows();
})();
