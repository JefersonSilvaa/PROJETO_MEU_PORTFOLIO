(function () {
  function resetAdminForm() {
    var idInput = document.getElementById('productId');
    var nameInput = document.getElementById('productName');
    var priceInput = document.getElementById('productPrice');
    var categoryInput = document.getElementById('productCategory');
    var imageInput = document.getElementById('productImage');
    var descriptionInput = document.getElementById('productDescription');
    var colorsInput = document.getElementById('productColors');
    var sizesInput = document.getElementById('productSizes');
    var stockInput = document.getElementById('productStock');

    if (!idInput || !nameInput || !priceInput || !categoryInput || !imageInput || !descriptionInput || !colorsInput || !sizesInput || !stockInput) return;

    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    imageInput.value = '';
    descriptionInput.value = '';
    colorsInput.value = '';
    sizesInput.value = '';
    stockInput.value = '15';
  }

  function renderAdminProducts() {
    var root = document.getElementById('adminProductsList');
    var emptyState = document.getElementById('adminEmptyState');
    if (!root || !emptyState) return;

    var products = StoreData.getProducts();
    root.innerHTML = '';

    if (!products.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    products.forEach(function (product) {
      var productImage = StoreData.resolveProductImage(product);
      var fallbackImage = StoreData.getFallbackImage(product.categoria);
      var card = document.createElement('article');
      card.className = 'admin-product-card';
      card.innerHTML =
        '<img src="' + productImage + '" alt="' + product.nome + '" onerror="this.src=\'' + fallbackImage + '\'">' +
        '<div>' +
        '  <h3>' + product.nome + '</h3>' +
        '  <p>' + product.categoria + ' - ' + StoreData.formatPrice(product.preco) + '</p>' +
        '  <p class="admin-meta">Cores: ' + product.cores.join(', ') + '</p>' +
        '  <p class="admin-meta">Tamanhos: ' + product.tamanhos.join(', ') + '</p>' +
        '  <p class="admin-meta">Estoque: ' + product.estoque + '</p>' +
        '</div>' +
        '<div class="row-actions">' +
        '  <button class="btn btn-ghost" data-action="edit" data-id="' + product.id + '">Editar</button>' +
        '  <button class="btn btn-primary" data-action="delete" data-id="' + product.id + '">Excluir</button>' +
        '</div>';
      root.appendChild(card);
    });
  }

  function fillFormForEdit(product) {
    var idInput = document.getElementById('productId');
    var nameInput = document.getElementById('productName');
    var priceInput = document.getElementById('productPrice');
    var categoryInput = document.getElementById('productCategory');
    var imageInput = document.getElementById('productImage');
    var descriptionInput = document.getElementById('productDescription');
    var colorsInput = document.getElementById('productColors');
    var sizesInput = document.getElementById('productSizes');
    var stockInput = document.getElementById('productStock');

    if (!idInput || !nameInput || !priceInput || !categoryInput || !imageInput || !descriptionInput || !colorsInput || !sizesInput || !stockInput) return;

    idInput.value = String(product.id);
    nameInput.value = product.nome;
    priceInput.value = String(product.preco);
    categoryInput.value = product.categoria;
    imageInput.value = product.imagem;
    descriptionInput.value = product.descricao || '';
    colorsInput.value = (product.cores || []).join(', ');
    sizesInput.value = (product.tamanhos || []).join(', ');
    stockInput.value = String(product.estoque || 10);

    nameInput.focus();
  }

  function upsertProductFromForm() {
    var idInput = document.getElementById('productId');
    var nameInput = document.getElementById('productName');
    var priceInput = document.getElementById('productPrice');
    var categoryInput = document.getElementById('productCategory');
    var imageInput = document.getElementById('productImage');
    var descriptionInput = document.getElementById('productDescription');
    var colorsInput = document.getElementById('productColors');
    var sizesInput = document.getElementById('productSizes');
    var stockInput = document.getElementById('productStock');

    if (!idInput || !nameInput || !priceInput || !categoryInput || !imageInput || !descriptionInput || !colorsInput || !sizesInput || !stockInput) return;

    var products = StoreData.getProducts();
    var existingId = Number(idInput.value);
    var colors = colorsInput.value.split(',').map(function (item) { return item.trim(); }).filter(Boolean);
    var sizes = sizesInput.value.split(',').map(function (item) { return item.trim(); }).filter(Boolean);

    var payload = {
      id: existingId || StoreData.nextProductId(products),
      nome: nameInput.value.trim(),
      preco: Number(priceInput.value),
      categoria: categoryInput.value,
      imagem: imageInput.value.trim(),
      descricao: descriptionInput.value.trim(),
      cores: colors,
      tamanhos: sizes,
      estoque: Math.max(1, Number(stockInput.value || 1))
    };

    if (!payload.nome || !payload.preco || !payload.categoria || !payload.descricao || !payload.cores.length || !payload.tamanhos.length) {
      CartStore.showToast('Preencha todos os campos do produto');
      return;
    }

    if (!payload.imagem) {
      payload.imagem = StoreData.getFallbackImage(payload.categoria);
    }

    var productExists = products.some(function (item) {
      return item.id === payload.id;
    });

    var nextProducts;
    if (productExists) {
      nextProducts = products.map(function (item) {
        return item.id === payload.id ? payload : item;
      });
      CartStore.showToast('Produto atualizado com sucesso');
    } else {
      nextProducts = products.concat(payload);
      CartStore.showToast('Produto criado com sucesso');
    }

    StoreData.saveProducts(nextProducts);
    resetAdminForm();
    renderAdminProducts();
  }

  function deleteProduct(productId) {
    var products = StoreData.getProducts();
    var nextProducts = products.filter(function (item) {
      return item.id !== productId;
    });
    StoreData.saveProducts(nextProducts);

    var nextCart = CartStore.getCart().filter(function (item) {
      return item.id !== productId;
    });
    localStorage.setItem(StoreData.STORAGE_KEYS.cart, JSON.stringify(nextCart));

    CartStore.updateCartBadge();
    renderAdminProducts();
    CartStore.showToast('Produto excluido');
  }

  function initAdminPage() {
    if (!document.getElementById('productForm') || !document.getElementById('adminProductsList')) return;

    var form = document.getElementById('productForm');
    var clearBtn = document.getElementById('clearFormBtn');
    var listRoot = document.getElementById('adminProductsList');

    renderAdminProducts();

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        upsertProductFromForm();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', resetAdminForm);
    }

    if (listRoot) {
      listRoot.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) return;

        var action = target.dataset.action;
        var productId = Number(target.dataset.id);
        if (!action || !productId) return;

        var product = StoreData.getProducts().find(function (item) {
          return item.id === productId;
        });

        if (action === 'edit' && product) {
          fillFormForEdit(product);
        }

        if (action === 'delete') {
          deleteProduct(productId);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initAdminPage);
})();
