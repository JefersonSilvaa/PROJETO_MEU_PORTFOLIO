/**
 * Next service dynamic widget module.
 */

(function () {
    'use strict';

    const app = window.PIBESC;

    const getFallbackSchedule = () => ({
        dayNames: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
        days: {
            0: [
                { time: '08:00', name: 'EBD', message: 'Hoje temos Escola Biblica Dominical.' },
                { time: '09:15', name: 'Culto de Adoracao', message: 'Participe conosco do culto da manha.' },
                { time: '19:00', name: 'Culto de Adoracao', message: 'A noite, estaremos juntos em adoracao.' },
            ],
            2: [{ time: '18:00', name: 'Organizacoes Missionarias', message: 'Hoje temos organizacoes missionarias.' }],
            3: [{ time: '19:00', name: 'Culto de Oracao', message: 'Tempo de oracao, intercessao e comunhao.' }],
            4: [{ time: '19:00', name: 'PGM', message: 'Pequeno Grupo Multiplicador nos lares.' }],
            5: [{ time: '19:00', name: 'Encontro da UBAESC', message: 'Uniao de Adolescentes Batistas em Escada.' }],
            6: [{ time: '19:30', name: 'Uniao Jovem', message: 'Encontro da juventude para louvor e Palavra.' }],
        },
    });

    const getActivePeriod = (schedule, now) => {
        const periods = schedule.periods || {};
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const [key, period] of Object.entries(periods)) {
            if (!period.startDate || !period.endDate) continue;

            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);

            if (currentDate >= startDate && currentDate <= endDate) {
                return period;
            }
        }

        return null;
    };

    const loadSchedule = async () => {
        try {
            const response = await fetch(app.config.scheduleUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Failed to load schedule: ${response.status}`);
            return await response.json();
        } catch (error) {
            return getFallbackSchedule();
        }
    };

    const getNextService = (now, schedule) => {
        const activePeriod = getActivePeriod(schedule, now);
        const daysConfig = activePeriod ? activePeriod.schedule : (schedule.days || {});
        const dayNames = schedule.dayNames || [];

        const today = now.getDay();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        for (let offset = 0; offset < 7; offset += 1) {
            const dayIndex = (today + offset) % 7;
            const dayEvents = daysConfig[String(dayIndex)] || daysConfig[dayIndex] || [];

            const upcomingEvents = offset === 0
                ? dayEvents.filter((event) => app.utils.toMinutes(event.time) >= currentMinutes)
                : dayEvents;

            if (upcomingEvents.length) {
                const chosenEvent = upcomingEvents[0];

                return {
                    dayName: dayNames[dayIndex] || 'Domingo',
                    time: app.utils.formatDisplayTime(chosenEvent.time),
                    name: chosenEvent.name,
                    message: chosenEvent.message,
                    isToday: offset === 0,
                    periodLabel: activePeriod ? activePeriod.label : null,
                };
            }
        }

        return null;
    };

    app.modules.nextService = {
        async init({ nextServiceDay, nextServiceTime, nextServiceName, nextServiceMessage }) {
            if (!nextServiceDay || !nextServiceTime || !nextServiceName || !nextServiceMessage) return;

            const schedule = await loadSchedule();

            const renderNextService = () => {
                const nextService = getNextService(new Date(), schedule);
                if (!nextService) return;

                nextServiceDay.textContent = nextService.isToday ? 'Hoje' : nextService.dayName;
                nextServiceTime.textContent = nextService.time;
                nextServiceName.textContent = nextService.name;
                nextServiceMessage.textContent = nextService.message;
            };

            renderNextService();
            window.setInterval(renderNextService, app.config.nextServiceUpdateMs);
        },
    };
})();
