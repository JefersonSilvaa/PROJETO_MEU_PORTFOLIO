'use strict';

const moduleDefinitions = [
  {
    id: 'html-css-basico',
    title: 'HTML5 + CSS3 (Basico)',
    pathCandidates: [
      'Estudo-FRONT-END/HTML5+CSS3 (basico)',
      'Estudo-FRONT-END/HTML-CSS BASICO'
    ],
    description: 'Fundamentos de estrutura HTML e estilos iniciais para paginas modernas.'
  },
  {
    id: 'html-css-intermediario',
    title: 'HTML5 + CSS3 (Intermediario)',
    pathCandidates: [
      'Estudo-FRONT-END/HTML5+CSS3 (intermediario)',
      'Estudo-FRONT-END/HTML-CSS INTERMEDIARIO'
    ],
    description: 'Avancando com layout, responsividade e componentes reutilizaveis.'
  },
  {
    id: 'javascript-basico',
    title: 'JavaScript (Basico)',
    pathCandidates: [
      'Estudo-FRONT-END/JAVASCRIPT (BASICO)'
    ],
    description: 'Interatividade de paginas com DOM, eventos e logica aplicada.'
  },
  {
    id: 'javascript-intermediario',
    title: 'JavaScript (Basico + Intermediario)',
    pathCandidates: [
      'Estudo-FRONT-END/JAVASCRIPT (BASICO_INTERMEDIARIO)'
    ],
    description: 'Interatividade de paginas com DOM, eventos e logica aplicada.'
  },
  {
    id: 'logica',
    title: 'Logica de Programacao',
    pathCandidates: [
      'Estudo-FRONT-END/LOGICA DE PROGRAMCÃO',
      'Estudo-FRONT-END/LOGICA DE PROGRAMAÇÃO'
    ],
    description: 'Pensamento computacional e resolucao de problemas com algoritmos.'
  },
  {
    id: 'portfolio',
    title: 'Projetos de Portfolio',
    pathCandidates: [
      'Estudo-FRONT-END/PROJETOS-PORTFOLIO',
      'Estudo-FRONT-END/PROJETOS PARA PORTFÓLIO'
    ],
    description: 'Projetos completos para praticar arquitetura e apresentacao.'
  },
  {
    id: 'apps',
    title: 'Aplicativos (VS Code, GitHub)',
    pathCandidates: [
      'Estudo-FRONT-END/aplicativos (VSCODE,GIT,GITHUB)',
      'Estudo-FRONT-END/APLICATIVOS'
    ],
    description: 'Ferramentas essenciais para o fluxo profissional de front-end.'
  }
];

const moduleList = document.getElementById('moduleList');
const moduleSelect = document.getElementById('moduleSelect');
const lessonList = document.getElementById('lessonList');
const moduleTitle = document.getElementById('moduleTitle');
const moduleDescription = document.getElementById('moduleDescription');
const searchInput = document.getElementById('searchInput');

const lessonContentTitle = document.getElementById('lessonContentTitle');
const lessonContentDesc = document.getElementById('lessonContentDesc');
const lessonTopics = document.getElementById('lessonTopics');
const selectedPath = document.getElementById('selectedPath');
const previewFrame = document.getElementById('previewFrame');
const openDirect = document.getElementById('openDirect');
const openSelected = document.getElementById('openSelected');

const codePath = document.getElementById('codePath');
const codeBlock = document.getElementById('codeBlock');
const openCodeDirect = document.getElementById('openCodeDirect');
const copyCode = document.getElementById('copyCode');
const expandCode = document.getElementById('expandCode');
const codeTabs = Array.from(document.querySelectorAll('.code-tab'));

const state = {
  modules: [],
  activeModuleId: null,
  activeLessonPath: null,
  query: '',
  activeTab: 'html',
  activePaths: { html: null, css: null, js: null },
  lastCodeText: ''
};

function toUnixPath(value) {
  let decoded = value || '';
  try {
    decoded = decodeURIComponent(decoded);
  } catch (_error) {
    decoded = value || '';
  }

  return decoded
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/');
}

function collapsePathSegments(path) {
  const parts = toUnixPath(path).split('/');
  const stack = [];

  for (const part of parts) {
    if (!part || part === '.') {
      continue;
    }
    if (part === '..') {
      stack.pop();
      continue;
    }
    stack.push(part);
  }

  return stack.join('/');
}

function toContentPath(path) {
  const clean = collapsePathSegments((path || '').replace(/^\/+/, ''));
  const lower = clean.toLowerCase();

  const idxConteudos = lower.indexOf('conteudos/');
  if (idxConteudos >= 0) {
    return clean.slice(idxConteudos).replace(/\/+$/, '');
  }

  const idxEstudo = lower.indexOf('estudo-front-end/');
  if (idxEstudo >= 0) {
    return `conteudos/${clean.slice(idxEstudo)}`.replace(/\/+$/, '');
  }

  return `conteudos/${clean}`.replace(/\/+$/, '');
}

function toBrowserUrl(path) {
  if (!path) {
    return '#';
  }

  const contentPath = toContentPath(path);
  const encoded = encodePath(contentPath);
  const rawPrefix = window.location.pathname.includes('/conteudos/')
    ? window.location.pathname.split('/conteudos/')[0]
    : '';
  const prefix = rawPrefix.replace(/\/+$/, '');
  const full = `${prefix}/${encoded}`.replace(/\/+/g, '/');
  return full.startsWith('/') ? full : `/${full}`;
}

function normalizeHref(href, basePath = '') {
  if (!href) {
    return '';
  }

  const cleanHref = toUnixPath(href).trim();
  const cleanBase = toContentPath(basePath).replace(/^\/+|\/+$/g, '');

  if (/^https?:\/\//i.test(cleanHref)) {
    return toContentPath(new URL(cleanHref).pathname);
  }

  let path = cleanHref.replace(/\/+$/, '');

  if (path.startsWith('/')) {
    return toContentPath(path);
  }

  if (!path.startsWith('conteudos/') && !path.startsWith('Estudo-FRONT-END/')) {
    path = `${cleanBase}/${path}`;
  }

  return toContentPath(collapsePathSegments(path));
}

function encodePath(path) {
  return path
    .split('/')
    .map((piece) => encodeURIComponent(piece))
    .join('/');
}

function humanize(text) {
  return decodeURIComponent(text)
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function prettifyTitle(text) {
  return humanize(text).replace(/\b\w/g, (char) => char.toUpperCase());
}

function getLessonShortPath(path) {
  return path.replace(/^conteudos\//, '');
}

async function fetchText(path) {
  const response = await fetch(toBrowserUrl(path), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}`);
  }
  return response.text();
}

async function pathExists(path) {
  if (!path) {
    return false;
  }

  try {
    const response = await fetch(toBrowserUrl(path), { cache: 'no-store' });
    return response.ok;
  } catch (_error) {
    return false;
  }
}

async function getDirectoryEntries(path) {
  try {
    const listing = await fetchText(path.endsWith('/') ? path : `${path}/`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(listing, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'));

    return links
      .map((anchor) => {
        const href = anchor.getAttribute('href');
        const label = anchor.textContent.trim();
        const cleanLabel = label.replace(/[\\/]+$/, '');

        if (!href || href.startsWith('#') || href.startsWith('?') || !cleanLabel || /^\.{1,2}$/.test(cleanLabel)) {
          return null;
        }

        const fullPath = normalizeHref(href, path);
        if (!fullPath.toLowerCase().includes('conteudos/estudo-front-end/')) {
          return null;
        }

        const isDirectory = /[\\/]$/.test(label) || !/\.[a-z0-9]+$/i.test(fullPath);
        return {
          name: cleanLabel,
          path: fullPath.replace(/\/$/, ''),
          isDirectory,
          isFile: !isDirectory
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.warn('Erro ao listar diretorio:', path, error);
    return [];
  }
}

async function findFilesInDirectory(basePath, depth = 0) {
  if (depth > 2) {
    return [];
  }

  const entries = await getDirectoryEntries(basePath);
  const files = entries.filter((entry) => entry.isFile);
  const folders = entries.filter((entry) => entry.isDirectory);

  const nestedFiles = [];
  for (const folder of folders) {
    const nested = await findFilesInDirectory(folder.path, depth + 1);
    nestedFiles.push(...nested);
  }

  return [...files, ...nestedFiles];
}

function extractAssetsFromHtml(content, htmlPath) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const baseDir = htmlPath.split('/').slice(0, -1).join('/');

  const toAbsolute = (value) => {
    if (!value) {
      return null;
    }
    if (/^https?:\/\//i.test(value) || value.startsWith('//')) {
      return null;
    }
    const clean = value.replace(/\\/g, '/');
    if (clean.startsWith('/')) {
      return normalizeHref(clean);
    }
    return normalizeHref(`${baseDir}/${clean}`);
  };

  const cssHref = doc.querySelector('link[rel="stylesheet"][href]')?.getAttribute('href');
  const jsSrc = doc.querySelector('script[src]')?.getAttribute('src');
  return {
    css: toAbsolute(cssHref),
    js: toAbsolute(jsSrc)
  };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(code, lang) {
  let out = escapeHtml(code);

  out = out.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');

  if (lang === 'html') {
    out = out.replace(/(&lt;\/?)([a-z0-9-]+)([^&]*?&gt;)/gi, '$1<span class="tok-tag">$2</span>$3');
    out = out.replace(/([a-z-:]+)=(&quot;[^&]*?&quot;)/gi, '<span class="tok-attr">$1</span>=$2');
  }

  if (lang === 'css') {
    out = out.replace(/([.#]?[a-z0-9_-]+)(\s*\{)/gi, '<span class="tok-tag">$1</span>$2');
    out = out.replace(/([a-z-]+)(\s*:)/gi, '<span class="tok-attr">$1</span>$2');
  }

  if (lang === 'js') {
    out = out.replace(/\b(function|const|let|var|if|else|return|for|while|class|new|import|from|export|await|async)\b/g, '<span class="tok-keyword">$1</span>');
    out = out.replace(/([a-zA-Z_$][\w$]*)(\()/g, '<span class="tok-func">$1</span>$2');
  }

  out = out.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-string">$1</span>');
  return out;
}

function setCodeTabs(paths) {
  codeTabs.forEach((tab) => {
    const key = tab.dataset.codeTab;
    const available = Boolean(paths[key]);
    tab.disabled = !available;
    tab.classList.toggle('active', key === state.activeTab && available);
    tab.style.opacity = available ? '1' : '0.45';
    tab.style.cursor = available ? 'pointer' : 'not-allowed';
  });

  if (!paths[state.activeTab]) {
    state.activeTab = ['html', 'css', 'js'].find((kind) => paths[kind]) || 'html';
    codeTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.codeTab === state.activeTab);
    });
  }
}

async function loadCode(path, language) {
  if (!path) {
    codePath.textContent = 'Nenhum arquivo desse tipo foi encontrado nesta aula.';
    codeBlock.innerHTML = '<code>// Arquivo indisponivel.</code>';
    state.lastCodeText = '';
    openCodeDirect.removeAttribute('href');
    return;
  }

  try {
    const text = await fetchText(path);
    state.lastCodeText = text;
    codePath.textContent = path;
    codeBlock.innerHTML = `<code>${highlight(text, language)}</code>`;
    openCodeDirect.href = toBrowserUrl(path);
  } catch (error) {
    codePath.textContent = `Falha ao abrir: ${path}`;
    codeBlock.innerHTML = `<code>// Nao foi possivel carregar ${path}</code>`;
    state.lastCodeText = '';
    openCodeDirect.removeAttribute('href');
  }
}

async function resolveLessonTargets(lesson) {
  const ext = lesson.path.split('.').pop()?.toLowerCase();

  if (lesson.isFile) {
    const map = { html: null, css: null, js: null };
    if (ext === 'html' || ext === 'htm') {
      map.html = lesson.path;
    }
    if (ext === 'css') {
      map.css = lesson.path;
    }
    if (ext === 'js') {
      map.js = lesson.path;
    }

    return {
      previewPath: map.html,
      directPath: lesson.path,
      codePaths: map
    };
  }

  const lessonName = lesson.path.split('/').filter(Boolean).pop() || '';

  const htmlCandidates = [
    `${lesson.path}/index.html`,
    `${lesson.path}/index.htm`,
    `${lesson.path}/${lessonName}.html`,
    `${lesson.path}/${lessonName}.htm`
  ];

  const cssCandidates = [
    `${lesson.path}/style.css`,
    `${lesson.path}/styles.css`,
    `${lesson.path}/main.css`
  ];

  const jsCandidates = [
    `${lesson.path}/script.js`,
    `${lesson.path}/main.js`,
    `${lesson.path}/app.js`
  ];

  let htmlPath = null;
  let cssPath = null;
  let jsPath = null;

  for (const candidate of htmlCandidates) {
    if (await pathExists(candidate)) {
      htmlPath = candidate;
      break;
    }
  }

  for (const candidate of cssCandidates) {
    if (await pathExists(candidate)) {
      cssPath = candidate;
      break;
    }
  }

  for (const candidate of jsCandidates) {
    if (await pathExists(candidate)) {
      jsPath = candidate;
      break;
    }
  }

  const files = await findFilesInDirectory(lesson.path);
  const htmlFile = htmlPath
    ? { path: htmlPath }
    : files.find((file) => /index\.html?$/i.test(file.path)) || files.find((file) => /\.html?$/i.test(file.path));
  const cssFile = cssPath
    ? { path: cssPath }
    : files.find((file) => /\.css$/i.test(file.path));
  const jsFile = jsPath
    ? { path: jsPath }
    : files.find((file) => /\.js$/i.test(file.path));
  const fallback = htmlFile || cssFile || jsFile || files[0];

  const codePaths = {
    html: htmlFile?.path || null,
    css: cssFile?.path || null,
    js: jsFile?.path || null
  };

  if (htmlFile?.path) {
    try {
      const htmlContent = await fetchText(htmlFile.path);
      const linked = extractAssetsFromHtml(htmlContent, htmlFile.path);
      if (!codePaths.css && linked.css) {
        codePaths.css = linked.css;
      }
      if (!codePaths.js && linked.js) {
        codePaths.js = linked.js;
      }
    } catch (error) {
      console.warn('Nao foi possivel extrair assets da aula:', htmlFile.path, error);
    }
  }

  return {
    previewPath: htmlFile?.path || null,
    directPath: fallback?.path || lesson.path,
    codePaths
  };
}

function getActiveModule() {
  return state.modules.find((module) => module.id === state.activeModuleId);
}

function getFilteredLessons(module) {
  if (!module) {
    return [];
  }
  const q = state.query.trim().toLowerCase();
  if (!q) {
    return module.lessons;
  }
  return module.lessons.filter((lesson) => lesson.name.toLowerCase().includes(q));
}

function renderModuleSelect() {
  moduleSelect.innerHTML = state.modules
    .map((module) => `<option value="${module.id}">${module.title}</option>`)
    .join('');
  moduleSelect.value = state.activeModuleId;
}

function renderModules() {
  moduleList.innerHTML = state.modules
    .map(
      (module) => `
        <button type="button" class="module-item ${module.id === state.activeModuleId ? 'active' : ''}" data-id="${module.id}">
          <div class="module-item__top">
            <strong>${module.title}</strong>
            <span class="module-badge">${module.lessons.length} itens</span>
          </div>
          <small>${module.description}</small>
        </button>
      `
    )
    .join('');

  moduleList.querySelectorAll('.module-item').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeModuleId = button.dataset.id;
      state.activeLessonPath = null;
      renderModuleSelect();
      renderModules();
      renderLessons();
    });
  });
}

function renderEmptyLessonState(message) {
  lessonList.innerHTML = `
    <div class="empty-state">
      <strong>Nenhuma aula encontrada</strong>
      <span>${message}</span>
    </div>
  `;
}

async function selectLesson(lesson) {
  state.activeLessonPath = lesson.path;

  const targets = await resolveLessonTargets(lesson);
  state.activePaths = targets.codePaths;
  setCodeTabs(state.activePaths);

  lessonContentTitle.textContent = prettifyTitle(lesson.name);
  lessonContentDesc.textContent = `Explore a aula ${humanize(lesson.name)} e acompanhe a estrutura no preview e no painel de codigo.`;
  lessonTopics.innerHTML = `
    <li>Entender a proposta principal da aula e o objetivo tecnico.</li>
    <li>Verificar implementacao pratica no preview renderizado.</li>
    <li>Analisar o codigo-fonte para reforcar o aprendizado.</li>
  `;

  if (targets.previewPath) {
    previewFrame.src = toBrowserUrl(targets.previewPath);
  } else {
    previewFrame.srcdoc = `
      <style>
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Poppins, sans-serif; background: #f8fafc; color: #475569; }
        article { max-width: 420px; margin: 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
        h2 { margin: 0 0 8px; font-size: 1.1rem; color: #1e293b; }
        p { margin: 0; line-height: 1.5; }
      </style>
      <article>
        <h2>Preview indisponivel</h2>
        <p>Esta aula nao possui arquivo HTML renderizavel. Use o botao "Abrir direto" para acessar os arquivos encontrados.</p>
      </article>
    `;
  }

  selectedPath.textContent = targets.directPath
    ? `Arquivo selecionado: ${targets.directPath}`
    : `Arquivo selecionado: ${lesson.path}`;

  if (targets.directPath) {
    openDirect.href = toBrowserUrl(targets.directPath);
  } else {
    openDirect.removeAttribute('href');
  }

  await loadCode(state.activePaths[state.activeTab], state.activeTab);

  lessonList.querySelectorAll('.lesson-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.path === lesson.path);
  });
}

function renderLessons() {
  const module = getActiveModule();
  if (!module) {
    renderEmptyLessonState('Verifique a pasta Estudo-FRONT-END e tente novamente.');
    return;
  }

  moduleTitle.textContent = module.title;
  moduleDescription.textContent = module.description;
  const lessons = getFilteredLessons(module).filter((lesson) => !/^\.{1,2}$/.test((lesson.name || '').trim()));

  if (!lessons.length) {
    renderEmptyLessonState('Tente um termo diferente na busca.');
    return;
  }

  lessonList.innerHTML = lessons
    .map(
      (lesson) => `
        <button type="button" class="lesson-item ${lesson.path === state.activeLessonPath ? 'active' : ''}" data-path="${lesson.path}">
          <strong>${prettifyTitle(lesson.name)}</strong>
          <small class="lesson-item__path">${getLessonShortPath(lesson.path)}</small>
        </button>
      `
    )
    .join('');

  lessonList.querySelectorAll('.lesson-item').forEach((button) => {
    button.addEventListener('click', async () => {
      const picked = lessons.find((item) => item.path === button.dataset.path);
      if (picked) {
        await selectLesson(picked);
      }
    });
  });

  if (!state.activeLessonPath || !lessons.some((lesson) => lesson.path === state.activeLessonPath)) {
    selectLesson(lessons[0]);
  }
}

async function listLessonsFromModule(moduleDef) {
  const candidates = moduleDef.pathCandidates || [moduleDef.path].filter(Boolean);

  for (const candidate of candidates) {
    const basePath = normalizeHref(candidate);
    const entries = await getDirectoryEntries(basePath);

    const lessons = entries
      .filter((entry) => entry.path !== basePath)
      .map((entry) => ({
        name: entry.name,
        path: entry.path,
        isFile: entry.isFile
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true }));

    if (lessons.length) {
      return lessons;
    }
  }

  return [];
}

function moduleFromQuery() {
  const aliases = {
    'html-basico': 'html-css-basico',
    htmlcssbasico: 'html-css-basico',
    'html-intermediario': 'html-css-intermediario',
    htmlcssintermediario: 'html-css-intermediario',
    javascript: 'javascript-basico',
    'js-basico': 'javascript-basico',
    'js-intermediario': 'javascript-intermediario',
    logica: 'logica',
    projetos: 'portfolio',
    portfolio: 'portfolio',
    aplicativos: 'apps',
    apps: 'apps'
  };

  const params = new URLSearchParams(window.location.search);
  const raw = (params.get('modulo') || '').toLowerCase();
  return aliases[raw] || null;
}

async function init() {
  moduleList.innerHTML = '<p class="empty-state">Carregando modulos...</p>';

  const loaded = [];
  for (const def of moduleDefinitions) {
    const lessons = await listLessonsFromModule(def);
    if (lessons.length) {
      loaded.push({ ...def, lessons });
    }
  }

  state.modules = loaded;

  if (!state.modules.length) {
    moduleList.innerHTML = `
      <div class="empty-state">
        <strong>Pasta de conteudos nao encontrada</strong>
        <span>Abra com servidor local para permitir leitura dos diretorios.</span>
      </div>
    `;
    renderEmptyLessonState('Nenhum modulo foi carregado.');
    return;
  }

  const preferred = moduleFromQuery();
  state.activeModuleId = state.modules.some((module) => module.id === preferred)
    ? preferred
    : state.modules[0].id;

  renderModuleSelect();
  renderModules();
  renderLessons();
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderLessons();
});

moduleSelect.addEventListener('change', () => {
  state.activeModuleId = moduleSelect.value;
  state.activeLessonPath = null;
  renderModules();
  renderLessons();
});

openSelected.addEventListener('click', () => {
  const path = state.activePaths[state.activeTab] || state.activeLessonPath;
  if (!path) {
    return;
  }
  window.open(toBrowserUrl(path), '_blank', 'noopener,noreferrer');
});

codeTabs.forEach((tab) => {
  tab.addEventListener('click', async () => {
    const type = tab.dataset.codeTab;
    if (!state.activePaths[type]) {
      return;
    }
    state.activeTab = type;
    setCodeTabs(state.activePaths);
    await loadCode(state.activePaths[type], type);
  });
});

copyCode.addEventListener('click', async () => {
  if (!state.lastCodeText) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.lastCodeText);
    copyCode.textContent = 'Copiado';
    setTimeout(() => {
      copyCode.textContent = 'Copiar';
    }, 1200);
  } catch (error) {
    copyCode.textContent = 'Erro';
    setTimeout(() => {
      copyCode.textContent = 'Copiar';
    }, 1200);
  }
});

expandCode.addEventListener('click', () => {
  const root = document.querySelector('.dashboard');
  root.classList.toggle('code-expanded');
  expandCode.textContent = root.classList.contains('code-expanded') ? 'Normal' : 'Expandir';
});

init();
