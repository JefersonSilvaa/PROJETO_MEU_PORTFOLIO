/**
 * PIBESC core namespace and shared config.
 */

(function () {
    'use strict';

    const app = window.PIBESC || {};
    app.modules = app.modules || {};

    app.config = {
        mobileBreakpoint: 900,
        nextServiceUpdateMs: 60 * 1000,
        scheduleUrl: 'assets/data/service-schedule.json',
        // Ano de fundação da igreja — altere quando souber o dia/mês exato
        // Para contar corretamente pelo dia do aniversário, defina também:
        // foundedMonth: 1-12  e  foundedDay: 1-31
        foundedYear: 1923,
        foundedMonth: null, // ex: 4 para abril — null usa apenas o ano
        foundedDay: null,   // ex: 15 para dia 15
    };

    app.getElements = () => ({
        navbar: document.querySelector('.navbar'),
        menuBtn: document.querySelector('.mobile-menu-btn'),
        closeBtn: document.querySelector('.mobile-close-btn'),
        overlay: document.querySelector('.mobile-overlay'),
        drawer: document.querySelector('.mobile-drawer'),
        agendaGrid: document.querySelector('.agenda-grid'),
        agendaTimeline: document.querySelector('.agenda-timeline'),
        nextServiceDay: document.getElementById('next-service-day'),
        nextServiceTime: document.getElementById('next-service-time'),
        nextServiceName: document.getElementById('next-service-name'),
        nextServiceMessage: document.getElementById('next-service-message'),
    });

    app.utils = {
        toMinutes(hhmm) {
            const [hour, minute] = hhmm.split(':').map(Number);
            return (hour * 60) + minute;
        },

        formatDisplayTime(hhmm) {
            const [hour, minute] = hhmm.split(':').map(Number);
            if (minute === 0) return `${hour}H`;
            return `${hour}H${String(minute).padStart(2, '0')}`;
        },
    };

    window.PIBESC = app;
})();
