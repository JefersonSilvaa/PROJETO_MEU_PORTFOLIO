/**
 * Carousel module.
 */

(function () {
    'use strict';

    const app = window.PIBESC;

    const initCarouselDots = (scrollEl, dotsEl, itemSelector) => {
        if (!scrollEl || !dotsEl) return;

        const items = Array.from(scrollEl.querySelectorAll(itemSelector));
        if (!items.length) return;

        dotsEl.innerHTML = '';

        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Item ${index + 1}`);
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

            if (wrap) {
                const atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 8;
                wrap.classList.toggle('is-end', atEnd);
            }
        };

        scrollEl.addEventListener('scroll', syncDots, { passive: true });
        syncDots();
    };

    app.modules.carousel = {
        init() {
            initCarouselDots(
                document.getElementById('carousel-cards'),
                document.getElementById('dots-cards'),
                '.feature-card'
            );

            initCarouselDots(
                document.getElementById('carousel-agenda'),
                document.getElementById('dots-agenda'),
                '.agenda-day'
            );
        },
    };
})();
