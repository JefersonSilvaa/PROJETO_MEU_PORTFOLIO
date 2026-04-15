#!/bin/bash
# Arquivo de inicialização rápida do Task Manager

echo "🚀 Task Manager - Quick Start"
echo "================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Download em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Navegar para backend
cd backend

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Criando .env com configurações padrão..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=sua_chave_secreta_muito_segura_123456789
NODE_ENV=development
EOF
    echo "✅ Arquivo .env criado!"
fi

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Tudo pronto!"
echo ""
echo "Para iniciar:"
echo "1. Abra um terminal aqui: cd backend"
echo "2. Execute: npm start"
echo "3. O servidor estará em: http://localhost:5000"
echo ""
echo "4. No outro terminal:"
echo "   - Use Live Server para o frontend (recomendado)"
echo "   - Ou: cd frontend && python -m http.server 8000"
echo ""
echo "5. Navegue para: http://localhost:5500 (Live Server)"
echo ""
