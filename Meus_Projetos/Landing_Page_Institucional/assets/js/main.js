/* ==========================================
   FRONT-END STUDY — main.js
   ========================================== */

'use strict';

/* ---------- Navbar: scroll shadow + active link ---------- */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.navbar__link');

function updateNavbar() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function setActiveLink() {
  const scrollPos = window.scrollY + 100;
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('href').replace('#', '');
    const section   = document.getElementById(sectionId);
    if (!section) return;
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  setActiveLink();
}, { passive: true });

updateNavbar();
setActiveLink();

/* ---------- Smooth scroll para links internos ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });

    // fechar menu mobile se estiver aberto
    if (navMenu.classList.contains('open')) closeMenu();
  });
});

/* ---------- Menu hambúrguer ---------- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

function openMenu() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Fechar menu ao clicar fora
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Fechar menu com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
});

/* ---------- Scroll Reveal ---------- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- Modais ---------- */
/**
 * Abre o modal cujo id é `modal-${key}`.
 * @param {string} key - chave do modal (html, css, js, calc, todo)
 */
function openModal(key) {
  const modal = document.getElementById('modal-' + key);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // foco no botão fechar para acessibilidade
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Botões que abrem modais dos cards de conteúdo e projetos
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

// Fechar via botão ×
document.querySelectorAll('.modal__close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
});

// Fechar clicando no overlay
document.querySelectorAll('.modal__overlay').forEach(overlay => {
  overlay.addEventListener('click', () => closeModal(overlay.closest('.modal')));
});

// Fechar com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.open');
    openModals.forEach(closeModal);
  }
});

/* ---------- Formulário de contato ---------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

/**
 * Valida um campo e exibe/limpa mensagem de erro.
 * @param {HTMLElement} field
 * @param {HTMLElement} errorEl
 * @param {string} message
 * @returns {boolean}
 */
function validateField(field, errorEl, message) {
  if (!field.value.trim()) {
    field.classList.add('error');
    errorEl.textContent = message;
    return false;
  }
  if (field.type === 'email') {
    // validação de e-mail — padrão conservador
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value.trim())) {
      field.classList.add('error');
      errorEl.textContent = 'Informe um e-mail válido.';
      return false;
    }
  }
  field.classList.remove('error');
  errorEl.textContent = '';
  return true;
}

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');

  const nomeError     = document.getElementById('nomeError');
  const emailError    = document.getElementById('emailError');
  const mensagemError = document.getElementById('mensagemError');

  const v1 = validateField(nome,     nomeError,     'Por favor, informe seu nome.');
  const v2 = validateField(email,    emailError,    'Por favor, informe seu e-mail.');
  const v3 = validateField(mensagem, mensagemError, 'Por favor, escreva sua mensagem.');

  if (!v1 || !v2 || !v3) return;

  // Simulação de envio
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    submitBtn.textContent = 'Enviar Mensagem';
    submitBtn.disabled = false;
    formSuccess.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    setTimeout(() => { formSuccess.textContent = ''; }, 5000);
  }, 1200);
});

// Limpar erro ao digitar
['nome', 'email', 'mensagem'].forEach(id => {
  const field = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  field.addEventListener('input', () => {
    field.classList.remove('error');
    error.textContent = '';
    formSuccess.textContent = '';
  });
});
