(function () {
  function buildCartKey(productId, color, size) {
    return [productId, color || '', size || ''].join('|');
  }

  function sanitizeCartItem(rawItem) {
    var products = StoreData.getProducts();
    var product = products.find(function (item) {
      return item.id === Number(rawItem.id);
    });

    var defaultColor = product && product.cores && product.cores.length ? product.cores[0] : 'Padrao';
    var defaultSize = product && product.tamanhos && product.tamanhos.length ? product.tamanhos[0] : 'Unico';
    var color = rawItem.cor || defaultColor;
    var size = rawItem.tamanho || defaultSize;

    return {
      id: Number(rawItem.id),
      quantidade: Math.max(1, Number(rawItem.quantidade || 1)),
      cor: color,
      tamanho: size,
      cartKey: rawItem.cartKey || buildCartKey(rawItem.id, color, size)
    };
  }

  function getCart() {
    return JSON.parse(localStorage.getItem(StoreData.STORAGE_KEYS.cart) || '[]').map(sanitizeCartItem);
  }

  function saveCart(cart) {
    localStorage.setItem(StoreData.STORAGE_KEYS.cart, JSON.stringify(cart));
  }

  function getCartCount() {
    return getCart().reduce(function (total, item) {
      return total + item.quantidade;
    }, 0);
  }

  function getCartDetailedItems() {
    const products = StoreData.getProducts();
    return getCart()
      .map(function (cartItem) {
        const product = products.find(function (item) {
          return item.id === cartItem.id;
        });

        if (!product) return null;

        return {
          cartKey: cartItem.cartKey,
          id: product.id,
          nome: product.nome,
          preco: product.preco,
          imagem: StoreData.resolveProductImage(product),
          fallbackImagem: StoreData.getFallbackImage(product.categoria),
          cor: cartItem.cor,
          tamanho: cartItem.tamanho,
          quantidade: cartItem.quantidade,
          subtotal: cartItem.quantidade * product.preco
        };
      })
      .filter(Boolean);
  }

  function addToCart(productId, quantity, details) {
    var product = StoreData.getProducts().find(function (item) {
      return item.id === productId;
    });
    if (!product) return;

    var selectedColor = details && details.cor ? details.cor : product.cores[0];
    var selectedSize = details && details.tamanho ? details.tamanho : product.tamanhos[0];
    const qty = quantity || 1;
    const cart = getCart();
    const cartKey = buildCartKey(productId, selectedColor, selectedSize);
    const index = cart.findIndex(function (item) {
      return item.cartKey === cartKey;
    });

    if (index >= 0) {
      cart[index].quantidade += qty;
    } else {
      cart.push({
        id: productId,
        quantidade: qty,
        cor: selectedColor,
        tamanho: selectedSize,
        cartKey: cartKey
      });
    }

    saveCart(cart);
    updateCartBadge();
  }

  function updateCartItemQuantity(cartKey, quantity) {
    let cart = getCart();
    cart = cart
      .map(function (item) {
        if (item.cartKey !== cartKey) return item;
        return {
          id: item.id,
          quantidade: quantity,
          cor: item.cor,
          tamanho: item.tamanho,
          cartKey: item.cartKey
        };
      })
      .filter(function (item) {
        return item.quantidade > 0;
      });

    saveCart(cart);
    updateCartBadge();
  }

  function removeCartItem(cartKey) {
    const nextCart = getCart().filter(function (item) {
      return item.cartKey !== cartKey;
    });
    saveCart(nextCart);
    updateCartBadge();
  }

  function clearCart() {
    saveCart([]);
    updateCartBadge();
  }

  function getCartTotal() {
    return getCartDetailedItems().reduce(function (acc, item) {
      return acc + item.subtotal;
    }, 0);
  }

  function showToast(message) {
    const root = document.getElementById('toastContainer');
    if (!root) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    root.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 2200);
  }

  function updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      badge.textContent = String(getCartCount());
    }
  }

  function renderCartPage() {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('cartEmptyState');
    const subtotalValue = document.getElementById('subtotalValue');
    const shippingValue = document.getElementById('shippingValue');
    const totalValue = document.getElementById('totalValue');

    if (!container || !emptyState || !subtotalValue || !shippingValue || !totalValue) return;

    const items = getCartDetailedItems();
    container.innerHTML = '';

    if (!items.length) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    items.forEach(function (item) {
      const element = document.createElement('article');
      element.className = 'cart-item';
      element.innerHTML =
        '<img src="' + item.imagem + '" alt="' + item.nome + '" onerror="this.src=\'' + item.fallbackImagem + '\'">' +
        '<div>' +
        '  <h3>' + item.nome + '</h3>' +
        '  <p>' + StoreData.formatPrice(item.preco) + '</p>' +
        '  <p class="variant-line">Cor: <strong>' + item.cor + '</strong> | Tamanho: <strong>' + item.tamanho + '</strong></p>' +
        '  <div class="qty-controls">' +
        '    <button class="qty-btn" data-action="minus" data-key="' + item.cartKey + '">-</button>' +
        '    <strong>' + item.quantidade + '</strong>' +
        '    <button class="qty-btn" data-action="plus" data-key="' + item.cartKey + '">+</button>' +
        '  </div>' +
        '</div>' +
        '<div>' +
        '  <p><strong>' + StoreData.formatPrice(item.subtotal) + '</strong></p>' +
        '  <button class="btn btn-ghost" data-action="remove" data-key="' + item.cartKey + '">Remover</button>' +
        '</div>';
      container.appendChild(element);
    });

    const subtotal = getCartTotal();
    const shipping = items.length ? 19.9 : 0;
    const total = subtotal + shipping;

    subtotalValue.textContent = StoreData.formatPrice(subtotal);
    shippingValue.textContent = StoreData.formatPrice(shipping);
    totalValue.textContent = StoreData.formatPrice(total);
  }

  function initCartInteractions() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    container.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.dataset.action;
      const cartKey = target.dataset.key;
      if (!action || !cartKey) return;

      const item = getCart().find(function (cartItem) {
        return cartItem.cartKey === cartKey;
      });

      if (action === 'plus' && item) {
        updateCartItemQuantity(cartKey, item.quantidade + 1);
      }

      if (action === 'minus' && item) {
        updateCartItemQuantity(cartKey, item.quantidade - 1);
      }

      if (action === 'remove') {
        removeCartItem(cartKey);
        showToast('Item removido do carrinho');
      }

      renderCartPage();
    });
  }

  function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('closeModalBtn');

    if (!form || !modal || !closeBtn) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!getCartDetailedItems().length) {
        showToast('Adicione produtos antes de finalizar');
        return;
      }

      clearCart();
      renderCartPage();
      modal.classList.remove('hidden');
      form.reset();
    });

    closeBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  function initCartPage() {
    if (!document.getElementById('cartItemsContainer')) return;

    renderCartPage();
    initCartInteractions();
    initCheckoutForm();
  }

  window.CartStore = {
    getCart: getCart,
    addToCart: addToCart,
    removeCartItem: removeCartItem,
    updateCartItemQuantity: updateCartItemQuantity,
    clearCart: clearCart,
    getCartCount: getCartCount,
    getCartDetailedItems: getCartDetailedItems,
    getCartTotal: getCartTotal,
    showToast: showToast,
    updateCartBadge: updateCartBadge,
    initCartPage: initCartPage,
    renderCartPage: renderCartPage
  };
})();
