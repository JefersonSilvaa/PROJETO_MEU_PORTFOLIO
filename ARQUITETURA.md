# ARQUITETURA DO PROJETO - PORTFOLIO

## Objetivo
Documentar a arquitetura atual do repositório, incluindo o site principal, organização de assets, integração com subprojetos e padrão de manutenção.

## Data de referência
12/05/2026

---

## Visão Geral

O repositório funciona como um hub de portfólio:
- Site principal estático em HTML + CSS + JavaScript.
- Lista de projetos reais com links para subpastas locais e links externos.
- Cada projeto pode ter sua própria arquitetura interna (estático, full stack, Vite + React etc.).

O fluxo principal é:
1. Usuário acessa o site raiz.
2. Visualiza seções institucionais e cards de projetos.
3. Navega para projetos internos por link direto.
4. Aciona contato por WhatsApp e redes sociais.

---

## Estrutura Atual do Repositório

```text
PROJETO_MEU_PORTFOLIO/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── img/
│   ├── favicon/
│   └── Imagens_projetos/
├── Meus_Projetos/
│   ├── calculadora_JS/
│   ├── e-commerce_moderno/
│   ├── Landing_Page_Institucional/
│   ├── Projeto_gestão_empresarial/
│   │   ├── backend/
│   │   └── frontend/
│   ├── Projeto_Pibesc/
│   └── Sistema_de_tarefa(Task Manager)/
│       ├── backend/
│       └── frontend/
├── projeto-gestao/
├── ARQUITETURA.md
└── README.md
```

Observação:
- A pasta `projeto-gestao/` na raiz contém build de frontend publicado (artefato estático).
- A pasta `Meus_Projetos/Projeto_gestão_empresarial/` contém código-fonte separado de backend e frontend.

---

## Arquitetura do Site Principal

### 1) Camada de Estrutura (HTML)
Arquivo: `index.html`

Seções principais:
- Header com navegação desktop/mobile.
- Hero com apresentação pessoal e CTAs.
- Sobre, Habilidades, Projetos, Experiência e Contato.
- Footer com links e redes.

Dependências CDN:
- Google Fonts (Poppins).
- AOS (Animate On Scroll).
- Bootstrap Icons.

### 2) Camada de Estilo (CSS)
Arquivo: `css/style.css`

Padrão adotado:
- BEM para componentes (`.navbar__link`, `.card--project`).
- Utilitárias customizadas (`.text-muted`, `.grid-2`, `.mb-lg`, `.w-full`).
- Design tokens em `:root` (cores, tipografia, espaçamento, raio, sombra e transições).

Organização lógica do CSS:
- Variáveis globais.
- Reset/base.
- Tipografia.
- Layout/containers.
- Componentes (navbar, botões, cards, formulários, footer etc.).
- Responsividade por media queries.

### 3) Camada de Comportamento (JavaScript)
Arquivo: `js/main.js`

Responsabilidades implementadas:
- Inicialização do AOS.
- Construção de links de WhatsApp com mensagem dinâmica.
- Eventos dos botões de CTA (desktop, mobile e flutuante).
- Envio do formulário de contato para WhatsApp.
- Limpeza de formulário.
- Toggle do menu mobile.
- Toggle de exibição da seção "Todos os Projetos".

---

## Integração com Projetos do Portfólio

Projetos em destaque no site:
- Sistema de Gestão Empresarial.
- E-commerce Moderno.
- Sistema de Tarefas (Task Manager).
- Landing Page Institucional.

Projetos adicionais:
- Calculadora JS.
- Projeto PIBESC.

Modelo de integração:
- Card no site principal com resumo, stack e preview visual.
- Link para pasta local do projeto ou link externo (GitHub).

---

## Convenções de Código

### HTML
- Estrutura semântica por seção.
- IDs para navegação em âncoras (`#home`, `#projects`, `#contact`).
- Classes consistentes entre componentes e utilitários.

### CSS
- Tokenização no `:root` para padronizar identidade visual.
- Reuso de utilitários para espaçamento e alinhamento.
- Preferência por classes estáveis em vez de estilos inline.

### JavaScript
- Código orientado a eventos com validação de existência dos elementos.
- Funções utilitárias para evitar repetição (`makeWhatsUrl`, `openInNewTab`).
- Seletores baseados em IDs e classes já definidos no HTML.

---

## Status da Migração e Melhorias

- [x] Remoção da base antiga dependente de classes utilitárias externas.
- [x] Centralização dos estilos em `css/style.css`.
- [x] Padronização principal para BEM + utilitárias próprias.
- [x] Estruturação do JS para ações centrais de interação.
- [x] Responsividade funcional no layout principal.
- [ ] Remover estilos inline restantes em botões e links sociais.
- [ ] Extrair constantes de contato (email, telefone, LinkedIn) para configuração única.
- [ ] Separar `js/main.js` em módulos por domínio (navegação, contato, projetos).

---

## Riscos Técnicos Atuais

1. Alguns estilos inline ainda existem no HTML, o que dificulta manutenção visual em escala.
2. Dados de contato e mensagens estão hardcoded no JavaScript.
3. Há coexistência de artefatos de build e código-fonte em pastas diferentes para o mesmo projeto de gestão, exigindo cuidado na publicação.

---

## Diretriz para Novas Atualizações

Para adicionar novo projeto ao portfólio:
1. Criar pasta do projeto em `Meus_Projetos/` ou publicar build estático em pasta dedicada.
2. Adicionar card em `index.html` com nome, descrição, stack e link.
3. Incluir imagem de preview em `img/Imagens_projetos/`.
4. Garantir classes já existentes para manter consistência visual.
5. Validar comportamento em mobile e desktop.

Para manter qualidade arquitetural:
1. Priorizar reaproveitamento de componentes CSS existentes.
2. Evitar criação de estilos inline novos.
3. Atualizar este documento a cada mudança estrutural relevante.

