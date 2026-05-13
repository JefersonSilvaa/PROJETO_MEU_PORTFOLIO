/**
 * UniJovens page initialization.
 */

(function () {
    'use strict';

    const app = window.PIBESC;
    if (!app || !app.modules || !app.modules.carousel) return;

    // ── Menu Mobile ──
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const closeBtn = document.querySelector('.mobile-close-btn');
        const overlay = document.querySelector('.mobile-overlay');
        const drawer = document.querySelector('.mobile-drawer');

        if (!menuBtn || !drawer) return;

        const closeMenu = () => {
            document.body.classList.remove('mobile-menu-open');
            drawer.setAttribute('aria-hidden', 'true');
            menuBtn.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            document.body.classList.add('mobile-menu-open');
            drawer.setAttribute('aria-hidden', 'false');
            menuBtn.setAttribute('aria-expanded', 'true');
        };

        menuBtn.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
    };

    // ── Smooth Scroll & Scroll to Top ──
    const initScrollBehavior = () => {
        // Links internos com scroll suave
        document.querySelectorAll('a[href^=\"#\"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId.length < 2) return;

                const target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Botão UNIJOVENS (scroll to top)
        const brandBtn = document.querySelector('.nav-brand-unijovens');
        if (brandBtn) {
            brandBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // ── Carousel de Eventos ──
    const initEventCarousel = () => {
        const scrollEl = document.getElementById('carousel-eventos');
        const dotsEl = document.getElementById('dots-eventos');

        if (!scrollEl || !dotsEl) return;

        const items = Array.from(scrollEl.querySelectorAll('.event-card'));
        if (!items.length) return;

        dotsEl.innerHTML = '';

        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Evento ${index + 1}`);
            dot.addEventListener('click', () => {
                items[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            });
            dotsEl.appendChild(dot);
        });

        const dots = Array.from(dotsEl.querySelectorAll('.carousel-dot'));
        const wrap = scrollEl.closest('.carousel-wrap');

        const syncDots = () => {
            const scrollLeft = scrollEl.scrollLeft;
            let activeIndex = 0;
            let minDistance = Number.POSITIVE_INFINITY;

            items.forEach((item, index) => {
                const distance = Math.abs(item.offsetLeft - scrollLeft);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === activeIndex);
            });
        };

        scrollEl.addEventListener('scroll', syncDots, { passive: true });
        syncDots();
    };

    // Initialize all
    window.addEventListener('load', () => {
        initMobileMenu();
        initScrollBehavior();
        initEventCarousel();
    });
})();
