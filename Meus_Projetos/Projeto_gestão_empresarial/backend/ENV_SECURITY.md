# Seguranca de Variaveis de Ambiente

Este arquivo descreve quais variaveis sao sensiveis e como usar com seguranca em dev/prod.

## Regras essenciais

1. Nunca commitar `.env` real.
2. Versionar apenas `.env.example` com placeholders.
3. Rotacionar segredos se houver suspeita de vazamento.
4. Usar segredos diferentes para development, staging e production.

## Variaveis sensiveis (NAO expor)

- `JWT_SECRET`
  - Assina tokens de autenticacao.
  - Se vazar, invasores podem forjar sessoes.
  - Use valor aleatorio forte (32+ caracteres).

- `DB_PASSWORD`
  - Senha do banco MySQL.
  - Deve ficar apenas em secret manager ou `.env` local/servidor.

- `ADMIN_PASSWORD`
  - Senha usada para seed inicial quando `SEED_ADMIN=true`.
  - Nunca usar senha padrao.
  - Recomendado minimo de 12 caracteres.

- `SMTP_PASS`
  - Senha/token da conta de envio de e-mail.
  - Tratar como credencial critica.

## Variaveis semissensiveis (evitar exposicao desnecessaria)

- `DB_HOST`, `DB_USER`, `DB_NAME`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_FROM`
- `ADMIN_EMAIL`

Nao sao segredos absolutos em todos os cenarios, mas podem revelar infraestrutura.

## Variaveis nao sensiveis (normalmente publicas/internas)

- `NODE_ENV`
- `PORT`
- `DB_DIALECT`
- `DB_STORAGE` (quando local)
- `FRONTEND_URL`
- `JWT_EXPIRES_IN`
- `SEED_ADMIN`

## Recomendações por ambiente

### Development

- Pode usar `DB_DIALECT=sqlite`.
- Pode ativar `SEED_ADMIN=true` temporariamente.
- Use credenciais de teste, nunca de producao.

### Production

- Preferir `DB_DIALECT=mysql` com usuario de menor privilegio.
- `SEED_ADMIN=false` apos provisionamento inicial.
- Armazenar segredos em painel da plataforma (Render/Vercel/GitHub Secrets).
- Habilitar rotacao periodica de `JWT_SECRET`, `DB_PASSWORD` e `SMTP_PASS`.
