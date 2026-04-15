@echo off
REM Arquivo de inicialização rápida do Task Manager para Windows

echo.
echo Task Manager - Quick Start
echo ================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo X Node.js nao esta instalado!
    echo Download em: https://nodejs.org/
    pause
    exit /b 1
)

REM Ver versão do Node.js
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo + Node.js encontrado: %NODE_VERSION%
echo.

REM Navegar para backend
cd backend

REM Verificar se .env existe
if not exist .env (
    echo Arquivo .env nao encontrado!
    echo Criando .env com configuracoes padrao...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/task-manager
        echo JWT_SECRET=sua_chave_secreta_muito_segura_123456789
        echo NODE_ENV=development
    ) > .env
    echo + Arquivo .env criado!
)

echo.
echo Instalando dependencias...
echo.
call npm install

echo.
echo + Tudo pronto!
echo.
echo Para iniciar:
echo 1. Abra um NOVO terminal aqui
echo 2. Execute: npm start
echo 3. O servidor estara em: http://localhost:5000
echo.
echo 4. No seu navegador:
echo    - Abra: http://localhost:5500 (Live Server)
echo    - Ou use: python -m http.server 8000 na pasta frontend
echo.
pause
