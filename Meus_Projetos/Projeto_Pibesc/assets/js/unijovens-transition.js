/**
 * Transition module for UniJovens page navigation.
 */

(function () {
    'use strict';

    const app = window.PIBESC;
    if (!app) return;

    const TRANSITION_MS = 760;
    const DEFAULT_TARGET = 'unijovens.html';

    const navigateTo = (url) => {
        window.location.assign(url || DEFAULT_TARGET);
    };

    const runTransition = (originElement, targetUrl) => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const badge = document.getElementById('nav-brand-badge');

        if (!originElement || !badge || prefersReducedMotion) {
            navigateTo(targetUrl);
            return;
        }

        if (document.body.classList.contains('unijovens-transitioning')) return;

        const originRect = originElement.getBoundingClientRect();
        const badgeRect = badge.getBoundingClientRect();

        const floatingWord = document.createElement('span');
        floatingWord.className = 'unijovens-float-word';
        floatingWord.textContent = 'UNIJOVENS';
        floatingWord.style.left = `${originRect.left + (originRect.width / 2)}px`;
        floatingWord.style.top = `${originRect.top + (originRect.height / 2)}px`;
        floatingWord.style.opacity = '0.95';
        floatingWord.style.transform = 'translate(-50%, -50%) scale(1)';

        document.body.appendChild(floatingWord);
        document.body.classList.add('unijovens-transitioning');

        window.requestAnimationFrame(() => {
            floatingWord.style.left = `${badgeRect.left + (badgeRect.width / 2)}px`;
            floatingWord.style.top = `${badgeRect.top + (badgeRect.height / 2)}px`;
            floatingWord.style.transform = 'translate(-50%, -50%) scale(1.15)';
            floatingWord.style.opacity = '0';
        });

        window.setTimeout(() => {
            navigateTo(targetUrl);
        }, TRANSITION_MS);
    };

    const bindLinkTransition = (link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            runTransition(link, link.getAttribute('href') || DEFAULT_TARGET);
        });
    };

    const bindCardTransition = (card, targetUrl) => {
        card.addEventListener('click', () => {
            runTransition(card, targetUrl);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            runTransition(card, targetUrl);
        });
    };

    app.modules.unijovensTransition = {
        init() {
            const triggers = document.querySelectorAll('[data-unijovens-trigger="true"]');
            const cardTrigger = document.querySelector('[data-unijovens-card="true"]');
            const firstUrl = triggers[0]?.getAttribute('href') || DEFAULT_TARGET;

            triggers.forEach(bindLinkTransition);
            if (cardTrigger) bindCardTransition(cardTrigger, firstUrl);
        },
    };
})();
