# Deploy - Variaveis de Ambiente (Render + Vercel)

## Backend (Render)

Configure no painel do Render as chaves abaixo:

- NODE_ENV=production
- PORT=3001
- DB_DIALECT=mysql
- DB_HOST=<secret>
- DB_PORT=3306
- DB_NAME=<secret>
- DB_USER=<secret>
- DB_PASSWORD=<secret>
- JWT_SECRET=<secret forte 32+>
- JWT_EXPIRES_IN=8h
- FRONTEND_URL=https://seu-frontend.vercel.app
- SEED_ADMIN=false
- ADMIN_EMAIL=<secret>
- ADMIN_PASSWORD=<secret 12+>
- SMTP_HOST=<secret>
- SMTP_PORT=587
- SMTP_USER=<secret>
- SMTP_PASS=<secret>
- SMTP_FROM=<secret>

## Frontend (Vercel)

No projeto frontend, configure:

- VITE_API_URL=https://seu-backend.onrender.com/api

## Boas praticas

1. Nao coloque segredos em arquivos versionados.
2. Use segredos diferentes para dev e prod.
3. Rotacione JWT_SECRET, DB_PASSWORD e SMTP_PASS apos qualquer suspeita de vazamento.
4. Em producao, mantenha SEED_ADMIN=false apos setup inicial.
