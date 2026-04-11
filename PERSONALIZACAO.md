# 📝 GUIA DE PERSONALIZAÇÃO - Portfólio

## 🎯 PRÓXIMOS PASSOS PARA DEIXAR SEU PORTFÓLIO PERFEITO

### 1. 📸 ADICIONE SUAS IMAGENS DE PROJETOS

**Localização**: `img/projetos/`

Crie/adicione imagens dos seus projetos:
- `projeto-1.jpg` - Sistema de Gestão Empresarial
- `projeto-2.jpg` - E-commerce Moderno
- `projeto-3.jpg` - API REST para Blog
- `projeto-4.jpg` - Landing Page Institucional

**Dicas para imagens**:
- Resolução: 800x600px (proporção 4:3)
- Formato: JPG ou PNG
- Qualidade: Boa, mas otimizada para web

### 2. 🔗 ATUALIZE OS LINKS DOS PROJETOS

No `index.html`, seção `#projects`, substitua os `href="#"` por:
- Links do GitHub dos projetos
- Links de deploy (Vercel, Netlify, etc.)
- Links de demonstração

### 3. 📊 AJUSTE OS NÍVEIS DE HABILIDADES

Na seção `#skills`, ajuste as porcentagens:
```html
<div class="skill-level__bar" style="width: 85%"></div>
<span class="skill-level__text">85% - Avançado</span>
```

**Sugestões de níveis**:
- Iniciante: 0-40%
- Básico: 40-60%
- Intermediário: 60-80%
- Avançado: 80-95%
- Expert: 95-100%

### 4. 👤 ATUALIZE SUAS INFORMAÇÕES

**No `index.html`**:
- Substitua "jeferson.alexandre@email.com" pelo seu email real
- Atualize links do LinkedIn, GitHub, Instagram
- Ajuste o número do WhatsApp
- Modifique a descrição pessoal na seção About

### 5. 🎨 PERSONALIZE AS CORES (OPCIONAL)

No `css/style.css`, modifique as variáveis CSS:
```css
:root {
  --color-accent: #007bff;        /* Azul */
  --color-accent-light: #4dabf7;  /* Azul claro */
  --color-bg: #0f0f0f;           /* Fundo escuro */
  --color-card: #1a1a1a;         /* Cards */
  /* ... outras cores */
}
```

### 6. 💼 ADICIONE SUA EXPERIÊNCIA REAL

Na seção `#experience`:
- Substitua as experiências de exemplo pelas suas reais
- Adicione datas corretas
- Inclua empresas/freelas que trabalhou
- Liste cursos e certificações que fez

### 7. 🌟 ADICIONE MAIS PROJETOS

Para adicionar mais projetos, duplique um card existente:
```html
<article class="card--project" data-aos="zoom-in" data-aos-delay="400">
  <div class="card__image">
    <img src="img/projetos/projeto-5.jpg" alt="Nome do Projeto" class="w-full h-48 object-cover rounded-t-lg">
  </div>
  <div class="card__content">
    <h4 class="card__title">Nome do Seu Projeto</h4>
    <p class="card__description">Descrição do que faz...</p>
    <div class="card__tech">
      <span class="tech-tag">Tech 1</span>
      <span class="tech-tag">Tech 2</span>
    </div>
    <div class="card__action">
      <a href="link-do-projeto" class="btn btn--primary w-full" target="_blank">Ver projeto</a>
    </div>
  </div>
</article>
```

### 8. 📱 TESTE A RESPONSIVIDADE

Abra o site em:
- Desktop (Chrome/Edge)
- Mobile (modo desenvolvedor)
- Tablet (modo desenvolvedor)

### 9. 🚀 PUBLIQUE SEU PORTFÓLIO

**Opções gratuitas**:
- **GitHub Pages**: Hospede diretamente do repositório
- **Vercel**: Deploy automático do GitHub
- **Netlify**: Interface amigável
- **Render**: Para projetos mais complexos

### 10. 🔍 OTIMIZAÇÕES FINAIS

- **Performance**: Comprima as imagens
- **SEO**: Adicione meta tags específicas
- **Acessibilidade**: Teste com leitores de tela
- **Velocidade**: Minimize CSS/JS se necessário

---

## 📋 CHECKLIST FINAL

- [ ] Imagens dos projetos adicionadas
- [ ] Links dos projetos atualizados
- [ ] Informações pessoais corrigidas
- [ ] Experiência profissional adicionada
- [ ] Habilidades calibradas
- [ ] Cores personalizadas (opcional)
- [ ] Testado em diferentes dispositivos
- [ ] Site publicado online
- [ ] Links compartilhados no LinkedIn/GitHub

---

## 💡 DICAS PROFISSIONAIS

1. **Mantenha atualizado**: Adicione novos projetos regularmente
2. **Seja específico**: Descreva claramente o que cada projeto faz
3. **Mostre resultados**: Inclua métricas quando possível
4. **Use cases reais**: Prefira projetos com propósito
5. **Clean code**: Mantenha o código organizado
6. **Versionamento**: Use Git para controlar mudanças

**🎉 Parabéns! Seu portfólio profissional está pronto!**