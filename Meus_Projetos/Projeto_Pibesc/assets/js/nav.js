/**
 * Navigation module.
 */

(function () {
    'use strict';

    const app = window.PIBESC;

    const initNavbarScrollState = (navbar) => {
        if (!navbar) return;

        const updateNavbar = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        };

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    };

    const initMobileDrawer = ({ menuBtn, closeBtn, overlay, drawer }) => {
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

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId.length < 2) return;

                const target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };

    const initAnniversaryBadge = () => {
        const el = document.getElementById('nav-anniversary-num');
        if (!el) return;

        const cfg = app.config;
        const now = new Date();
        const currentYear = now.getFullYear();

        let years = currentYear - cfg.foundedYear;

        // Se tiver dia e mês definidos, verifica se o aniversário já passou este ano
        if (cfg.foundedMonth && cfg.foundedDay) {
            const anniversaryThisYear = new Date(currentYear, cfg.foundedMonth - 1, cfg.foundedDay);
            if (now < anniversaryThisYear) {
                years -= 1; // aniversário ainda não chegou este ano
            }
        }

        el.textContent = years;
    };

    app.modules.nav = {
        init(elements) {
            initNavbarScrollState(elements.navbar);
            initMobileDrawer(elements);
            initSmoothScroll();
            initAnniversaryBadge();
        },
    };
})();
