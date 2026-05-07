/**
 * Agenda module.
 */

(function () {
    'use strict';

    const app = window.PIBESC;

    app.modules.agenda = {
        init({ agendaGrid, agendaTimeline }) {
            if (!agendaGrid || !agendaTimeline) return;

            const dayCards = Array.from(agendaGrid.querySelectorAll('.agenda-day'));
            const timelineItems = Array.from(agendaTimeline.querySelectorAll('.agenda-timeline-item'));

            if (!dayCards.length || dayCards.length !== timelineItems.length) return;

            const getProgressPercent = (index) => {
                const maxIndex = dayCards.length - 1;
                if (maxIndex <= 0) return '0%';
                return `${(index / maxIndex) * 100}%`;
            };

            const syncActiveDay = (activeIndex) => {
                dayCards.forEach((card, index) => {
                    card.classList.toggle('is-active', index === activeIndex);
                });

                timelineItems.forEach((item, index) => {
                    item.classList.toggle('is-active', index === activeIndex);
                });

                agendaTimeline.style.setProperty('--agenda-progress', getProgressPercent(activeIndex));
            };

            const getClosestCardIndex = () => {
                const gridBounds = agendaGrid.getBoundingClientRect();
                const referenceX = gridBounds.left + (gridBounds.width * 0.35);

                let closestIndex = 0;
                let closestDistance = Number.POSITIVE_INFINITY;

                dayCards.forEach((card, index) => {
                    const bounds = card.getBoundingClientRect();
                    const centerX = bounds.left + (bounds.width / 2);
                    const distance = Math.abs(centerX - referenceX);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });

                return closestIndex;
            };

            let ticking = false;
            agendaGrid.addEventListener('scroll', () => {
                if (ticking) return;

                ticking = true;
                window.requestAnimationFrame(() => {
                    syncActiveDay(getClosestCardIndex());
                    ticking = false;
                });
            }, { passive: true });

            timelineItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    dayCards[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start',
                    });
                    syncActiveDay(index);
                });
            });

            dayCards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    syncActiveDay(index);

                    if (window.innerWidth <= app.config.mobileBreakpoint) {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start',
                        });
                    }
                });

                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        card.click();
                    }
                });
            });

            syncActiveDay(0);
            window.addEventListener('resize', () => {
                syncActiveDay(getClosestCardIndex());
            });
        },
    };
})();
