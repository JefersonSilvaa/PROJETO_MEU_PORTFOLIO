(function () {
  function renderYear() {
    var yearNodes = document.querySelectorAll('#year');
    yearNodes.forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initMobileMenu() {
    var menuToggle = document.getElementById('menuToggle');
    var nav = document.getElementById('navLinks');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.closest('a')) {
        nav.classList.remove('open');
      }
    });
  }

  function getCurrentRoute() {
    var hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (hash === 'carrinho' || hash === 'admin') {
      return hash;
    }
    return 'home';
  }

  function updateRouteView() {
    var route = getCurrentRoute();
    var nav = document.getElementById('navLinks');
    var views = {
      home: document.getElementById('homeView'),
      carrinho: document.getElementById('cartView'),
      admin: document.getElementById('adminView')
    };

    if (nav) {
      nav.classList.remove('open');
    }

    Object.keys(views).forEach(function (key) {
      var view = views[key];
      if (!view) return;
      view.classList.toggle('hidden', key !== route);
    });

    document.querySelectorAll('[data-route]').forEach(function (link) {
      if (!(link instanceof HTMLElement)) return;
      link.classList.toggle('active', link.dataset.route === route);
    });

    if (route === 'carrinho') {
      CartStore.renderCartPage();
    }
  }

  function initRouteView() {
    updateRouteView();
    window.addEventListener('hashchange', updateRouteView);
  }

  function renderStars(rating) {
    var safeRating = Math.max(1, Math.min(5, Number(rating || 0)));
    var fullStars = Math.round(safeRating);
    var stars = '';
    for (var index = 0; index < 5; index += 1) {
      stars += '<span class="star' + (index < fullStars ? ' active' : '') + '">&#9733;</span>';
    }
    return stars;
  }

  function renderProducts(products) {
    var grid = document.getElementById('productsGrid');
    var emptyState = document.getElementById('emptyState');
    if (!grid || !emptyState) return;

    grid.innerHTML = '';

    if (!products.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    products.forEach(function (product) {
      var productImage = StoreData.resolveProductImage(product);
      var fallbackImage = StoreData.getFallbackImage(product.categoria);
      var ratingMarkup = renderStars(product.avaliacao);
      var card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML =
        '<button class="product-image-button" data-action="open-details" data-id="' + product.id + '">' +
        '  <img src="' + productImage + '" alt="' + product.nome + '" onerror="this.src=\'' + fallbackImage + '\'">' +
        '  <span class="product-image-overlay">' +
        '    <span class="overlay-icon">&#128269;</span>' +
        '    <span class="overlay-text">Visualizar detalhes</span>' +
        '  </span>' +
        '</button>' +
        '<div class="product-info">' +
        '  <p class="product-category">' + product.categoria + '</p>' +
        '  <h3 class="product-title">' + product.nome + '</h3>' +
        '  <div class="product-social">' +
        '    <div class="stars-row">' + ratingMarkup + '<span class="stars-score">' + product.avaliacao.toFixed(1).replace('.', ',') + '</span></div>' +
        '    <span class="sold-count">' + product.vendidos + ' compras</span>' +
        '  </div>' +
        '  <p class="product-price">' + StoreData.formatPrice(product.preco) + '</p>' +
        '  <p class="product-desc">' + product.descricao + '</p>' +
        '  <button class="btn btn-primary" data-id="' + product.id + '">Adicionar ao carrinho</button>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  function openProductDetailsModal(product) {
    var modal = document.getElementById('productDetailsModal');
    var body = document.getElementById('productDetailsBody');
    if (!modal || !body || !product) return;

    var colors = (product.cores || []).map(function (color, index) {
      var activeClass = index === 0 ? 'active' : '';
      return '<button type="button" class="option-chip ' + activeClass + '" data-role="color" data-value="' + color + '">' + color + '</button>';
    }).join('');

    var sizes = (product.tamanhos || []).map(function (size, index) {
      var activeClass = index === 0 ? 'active' : '';
      return '<button type="button" class="option-chip size ' + activeClass + '" data-role="size" data-value="' + size + '">' + size + '</button>';
    }).join('');

    var productImage = StoreData.resolveProductImage(product);
    var fallbackImage = StoreData.getFallbackImage(product.categoria);
    var comments = (product.comentarios || []).map(function (comment) {
      return '<article class="review-card">' +
        '  <p class="review-text">&ldquo;' + comment.texto + '&rdquo;</p>' +
        '  <p class="review-author">' + comment.nome + '</p>' +
        '</article>';
    }).join('');
    body.innerHTML =
      '<div class="detail-media">' +
      '  <img src="' + productImage + '" alt="' + product.nome + '" onerror="this.src=\'' + fallbackImage + '\'">' +
      '</div>' +
      '<div class="detail-content" data-product-id="' + product.id + '">' +
      '  <p class="detail-category">' + product.categoria + '</p>' +
      '  <h4>' + product.nome + '</h4>' +
      '  <div class="product-social detail-social">' +
      '    <div class="stars-row">' + renderStars(product.avaliacao) + '<span class="stars-score">' + product.avaliacao.toFixed(1).replace('.', ',') + '</span></div>' +
      '    <span class="sold-count">' + product.vendidos + ' clientes compraram</span>' +
      '  </div>' +
      '  <p class="detail-price">' + StoreData.formatPrice(product.preco) + '</p>' +
      '  <p class="detail-description">' + product.descricao + '</p>' +
      '  <p class="detail-label">Cor</p>' +
      '  <div class="detail-options">' + colors + '</div>' +
      '  <p class="detail-label">Tamanho</p>' +
      '  <div class="detail-options">' + sizes + '</div>' +
      '  <label class="qty-field">Quantidade <input id="detailQty" type="number" min="1" max="' + product.estoque + '" value="1"></label>' +
      '  <button class="btn btn-primary" data-action="add-details">Adicionar ao carrinho</button>' +
      '  <div class="reviews-block">' +
      '    <p class="detail-label">Comentarios de quem comprou</p>' +
      '    <div class="reviews-list">' + comments + '</div>' +
      '  </div>' +
      '</div>';

    modal.classList.remove('hidden');
  }

  function initDetailsModal() {
    var modal = document.getElementById('productDetailsModal');
    var body = document.getElementById('productDetailsBody');
    var closeBtn = document.getElementById('closeDetailsModalBtn');
    if (!modal || !body || !closeBtn) return;

    closeBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });

    body.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.matches('.option-chip')) {
        var role = target.dataset.role;
        if (!role) return;

        body.querySelectorAll('.option-chip[data-role="' + role + '"]').forEach(function (item) {
          item.classList.remove('active');
        });
        target.classList.add('active');
      }

      if (target.dataset.action === 'add-details') {
        var detailContent = body.querySelector('.detail-content');
        if (!detailContent) return;

        var productId = Number(detailContent.getAttribute('data-product-id'));
        var colorNode = body.querySelector('.option-chip[data-role="color"].active');
        var sizeNode = body.querySelector('.option-chip[data-role="size"].active');
        var qtyInput = document.getElementById('detailQty');
        var quantity = qtyInput ? Math.max(1, Number(qtyInput.value || 1)) : 1;

        CartStore.addToCart(productId, quantity, {
          cor: colorNode ? colorNode.dataset.value : '',
          tamanho: sizeNode ? sizeNode.dataset.value : ''
        });
        CartStore.showToast('Produto adicionado ao carrinho');
        modal.classList.add('hidden');
      }
    });
  }

  function initHomePage() {
    if (document.body.id !== 'home-page') return;

    var searchInput = document.getElementById('searchInput');
    var filtersRoot = document.getElementById('categoryFilters');
    var state = {
      category: 'todos',
      search: ''
    };

    function getFilteredProducts() {
      var products = StoreData.getProducts();
      return products.filter(function (product) {
        var categoryOk = state.category === 'todos' || product.categoria === state.category;
        var searchOk = !state.search || StoreData.normalizeText(product.nome).includes(StoreData.normalizeText(state.search));
        return categoryOk && searchOk;
      });
    }

    function updateView() {
      renderProducts(getFilteredProducts());
    }

    updateView();

    if (searchInput) {
      searchInput.addEventListener('input', function (event) {
        state.search = event.target.value || '';
        updateView();
      });
    }

    if (filtersRoot) {
      filtersRoot.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (!target.matches('button[data-category]')) return;

        state.category = target.dataset.category || 'todos';
        filtersRoot.querySelectorAll('button').forEach(function (button) {
          button.classList.remove('active');
        });
        target.classList.add('active');
        updateView();
      });
    }

    var grid = document.getElementById('productsGrid');
    if (grid) {
      grid.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) return;

        var trigger = target.closest('[data-id]');
        if (!(trigger instanceof HTMLElement)) return;

        var productId = Number(trigger.dataset.id);
        if (!productId) return;

        if (trigger.dataset.action === 'open-details') {
          var product = StoreData.getProducts().find(function (item) {
            return item.id === productId;
          });
          openProductDetailsModal(product);
          return;
        }

        if (target.matches('button[data-id]')) {
          CartStore.addToCart(productId, 1);
          CartStore.showToast('Produto adicionado ao carrinho');
        }
      });
    }

    initDetailsModal();
  }

  function initGlobal() {
    renderYear();
    initMobileMenu();
    initRouteView();
    CartStore.updateCartBadge();
    CartStore.initCartPage();
    initHomePage();
  }

  document.addEventListener('DOMContentLoaded', initGlobal);
})();
