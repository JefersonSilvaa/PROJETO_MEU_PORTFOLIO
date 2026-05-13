/**
 * PIBESC — main.js (bootstrap)
 * Inicializa os modulos carregados em assets/js.
 */

(function () {
    'use strict';

    const app = window.PIBESC;
    if (!app) return;

    const elements = app.getElements();

    app.modules.nav.init(elements);
    app.modules.carousel.init();
    app.modules.agenda.init(elements);
    app.modules.nextService.init(elements);
    if (app.modules.unijovensTransition) {
        app.modules.unijovensTransition.init();
    }
})();
