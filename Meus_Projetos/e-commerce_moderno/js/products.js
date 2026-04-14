(function () {
  const STORAGE_KEYS = {
    products: 'ecom_products_v1',
    cart: 'ecom_cart_v1',
    schemaVersion: 'ecom_schema_version'
  };
  const SCHEMA_VERSION = '3';

  const defaultProducts = [
    {
      id: 1,
      nome: 'Hoodie Neon Street',
      preco: 199.9,
      categoria: 'roupas',
      imagem: 'assets/images/hoodie-neon-street.svg',
      descricao: 'Moletom com toque macio e caimento urbano para uso diario.',
      cores: ['Preto', 'Cinza', 'Azul'],
      tamanhos: ['P', 'M', 'G', 'GG'],
      estoque: 20,
      avaliacao: 4.8,
      vendidos: 184,
      comentarios: [
        { nome: 'Lucas', texto: 'Vestiu muito bem e o tecido e grosso na medida certa.' },
        { nome: 'Marina', texto: 'Cor bonita e acabamento acima do esperado.' }
      ]
    },
    {
      id: 2,
      nome: 'Jaqueta Urban Wind',
      preco: 259.9,
      categoria: 'roupas',
      imagem: 'assets/images/jaqueta-urban-wind.svg',
      descricao: 'Jaqueta leve com visual clean e acabamento premium.',
      cores: ['Areia', 'Preto', 'Verde'],
      tamanhos: ['P', 'M', 'G', 'GG'],
      estoque: 16,
      avaliacao: 4.9,
      vendidos: 127,
      comentarios: [
        { nome: 'Renato', texto: 'Caimento excelente e muito confortavel para uso diario.' },
        { nome: 'Bianca', texto: 'Visual minimalista e elegante, virou minha favorita.' }
      ]
    },
    {
      id: 3,
      nome: 'Tenis Runner Pro',
      preco: 349.9,
      categoria: 'calcados',
      imagem: 'assets/images/tenis-runner-pro.svg',
      descricao: 'Tenis esportivo com amortecimento responsivo e solado aderente.',
      cores: ['Vermelho', 'Preto', 'Branco'],
      tamanhos: ['38', '39', '40', '41', '42'],
      estoque: 12,
      avaliacao: 4.7,
      vendidos: 241,
      comentarios: [
        { nome: 'Caio', texto: 'Muito leve e firme no pe, bom para caminhar o dia todo.' },
        { nome: 'Patricia', texto: 'Amortecimento muito bom e visual forte.' }
      ]
    },
    {
      id: 4,
      nome: 'Calca Jogger Core',
      preco: 149.9,
      categoria: 'roupas',
      imagem: 'assets/images/calca-jogger-core.svg',
      descricao: 'Jogger com elastico reforcado e tecido confortavel.',
      cores: ['Preto', 'Grafite'],
      tamanhos: ['P', 'M', 'G', 'GG'],
      estoque: 24,
      avaliacao: 4.6,
      vendidos: 163,
      comentarios: [
        { nome: 'Thiago', texto: 'Muito confortavel e combina com varios looks.' },
        { nome: 'Aline', texto: 'Modelagem boa e tecido macio.' }
      ]
    },
    {
      id: 5,
      nome: 'Bota Trail Pulse',
      preco: 279.9,
      categoria: 'calcados',
      imagem: 'assets/images/bota-trail-pulse.svg',
      descricao: 'Bota resistente para trilha urbana e uso diario.',
      cores: ['Marrom', 'Preto'],
      tamanhos: ['38', '39', '40', '41', '42'],
      estoque: 10,
      avaliacao: 4.8,
      vendidos: 96,
      comentarios: [
        { nome: 'Eduardo', texto: 'Estrutura firme e acabamento muito bonito.' },
        { nome: 'Sofia', texto: 'Passa seguranca no uso e e bem estilosa.' }
      ]
    },
    {
      id: 6,
      nome: 'Camiseta Minimal One',
      preco: 89.9,
      categoria: 'roupas',
      imagem: 'assets/images/camiseta-minimal-one.svg',
      descricao: 'Camiseta basica premium com algodao respiravel.',
      cores: ['Branco', 'Preto', 'Marinho'],
      tamanhos: ['P', 'M', 'G', 'GG'],
      estoque: 30,
      avaliacao: 4.5,
      vendidos: 312,
      comentarios: [
        { nome: 'Felipe', texto: 'Basica premium mesmo, veste muito bem.' },
        { nome: 'Lara', texto: 'Tecido leve e corte bonito para o dia a dia.' }
      ]
    }
  ];

  function parseJSON(value, fallback) {
    try {
      return JSON.parse(value) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function normalizeList(value, fallback) {
    if (Array.isArray(value) && value.length) {
      return value.map(function (item) {
        return String(item).trim();
      }).filter(Boolean);
    }

    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map(function (item) {
        return item.trim();
      }).filter(Boolean);
    }

    return fallback;
  }

  function normalizeComments(value) {
    if (!Array.isArray(value) || !value.length) {
      return [
        { nome: 'Cliente UrbanStyle', texto: 'Produto bem avaliado pelos clientes da loja.' }
      ];
    }

    return value.map(function (item) {
      return {
        nome: String(item && item.nome || 'Cliente UrbanStyle').trim(),
        texto: String(item && item.texto || '').trim() || 'Produto bem avaliado pelos clientes da loja.'
      };
    });
  }

  function normalizeProduct(product) {
    var fallbackColors = product.categoria === 'calcados' ? ['Preto', 'Branco'] : ['Preto', 'Cinza'];
    var fallbackSizes = product.categoria === 'calcados' ? ['38', '39', '40', '41'] : ['P', 'M', 'G', 'GG'];
    var categoria = product.categoria === 'calcados' ? 'calcados' : 'roupas';
    var image = String(product.imagem || '').trim();

    return {
      id: Number(product.id),
      nome: String(product.nome || '').trim(),
      preco: Number(product.preco || 0),
      categoria: categoria,
      imagem: image || getFallbackImage(categoria),
      descricao: String(product.descricao || 'Produto premium da UrbanStyle.').trim(),
      cores: normalizeList(product.cores, fallbackColors),
      tamanhos: normalizeList(product.tamanhos, fallbackSizes),
      estoque: Math.max(1, Number(product.estoque || 10)),
      avaliacao: Math.max(1, Math.min(5, Number(product.avaliacao || 4.7))),
      vendidos: Math.max(1, Number(product.vendidos || 48)),
      comentarios: normalizeComments(product.comentarios)
    };
  }

  function getFallbackImage(category) {
    return category === 'calcados'
      ? 'assets/images/fallback-calcados.svg'
      : 'assets/images/fallback-roupas.svg';
  }

  function resolveProductImage(product) {
    if (product && String(product.imagem || '').trim()) {
      return String(product.imagem).trim();
    }

    return getFallbackImage(product && product.categoria);
  }

  function getProducts() {
    return parseJSON(localStorage.getItem(STORAGE_KEYS.products), []).map(normalizeProduct);
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }

  function ensureStorageState() {
    var rawProducts = parseJSON(localStorage.getItem(STORAGE_KEYS.products), []);
    var rawCart = parseJSON(localStorage.getItem(STORAGE_KEYS.cart), []);
    var storedVersion = localStorage.getItem(STORAGE_KEYS.schemaVersion);
    var normalizedProducts = rawProducts.length ? rawProducts.map(normalizeProduct) : defaultProducts.map(normalizeProduct);
    var validIds = normalizedProducts.map(function (product) {
      return product.id;
    });
    var normalizedCart = rawCart
      .filter(function (item) {
        return item && validIds.indexOf(Number(item.id)) >= 0;
      })
      .map(function (item) {
        return {
          id: Number(item.id),
          quantidade: Math.max(1, Number(item.quantidade || 1)),
          cor: String(item.cor || '').trim(),
          tamanho: String(item.tamanho || '').trim(),
          cartKey: String(item.cartKey || '').trim()
        };
      });

    if (!rawProducts.length || storedVersion !== SCHEMA_VERSION) {
      saveProducts(normalizedProducts);
      saveCart(normalizedCart);
      localStorage.setItem(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION);
      return;
    }

    if (JSON.stringify(rawProducts) !== JSON.stringify(normalizedProducts)) {
      saveProducts(normalizedProducts);
    }
  }

  function nextProductId(products) {
    if (!products.length) return 1;
    return Math.max.apply(null, products.map(function (item) { return item.id; })) + 1;
  }

  function formatPrice(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function normalizeText(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  ensureStorageState();

  window.StoreData = {
    STORAGE_KEYS: STORAGE_KEYS,
    SCHEMA_VERSION: SCHEMA_VERSION,
    defaultProducts: defaultProducts,
    getProducts: getProducts,
    saveProducts: saveProducts,
    nextProductId: nextProductId,
    formatPrice: formatPrice,
    normalizeText: normalizeText,
    getFallbackImage: getFallbackImage,
    resolveProductImage: resolveProductImage
  };
})();
