const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

// Dados de teste
const testUsers = [
    {
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'senha123'
    },
    {
        name: 'Maria Santos',
        email: 'maria@test.com',
        password: 'senha123'
    },
    {
        name: 'Pedro Costa',
        email: 'pedro@test.com',
        password: 'senha123'
    }
];

const testTasks = {
    'joao@test.com': [
        { title: 'Aprender Node.js', completed: false, dueDate: new Date('2026-04-25') },
        { title: 'Fazer exercicio', completed: true, dueDate: new Date('2026-04-15') },
        { title: 'Finalizar projeto', completed: false, dueDate: new Date('2026-04-20') },
        { title: 'Ler documentacao React', completed: false, dueDate: null }
    ],
    'maria@test.com': [
        { title: 'Comprar mantimentos', completed: true, dueDate: new Date('2026-04-14') },
        { title: 'Revisar design', completed: false, dueDate: new Date('2026-04-18') },
        { title: 'Deploy em producao', completed: false, dueDate: new Date('2026-04-22') }
    ],
    'pedro@test.com': [
        { title: 'Debugar API', completed: false, dueDate: new Date('2026-04-16') },
        { title: 'Escrever testes', completed: false, dueDate: new Date('2026-04-17') },
        { title: 'Code review pull requests', completed: true, dueDate: new Date('2026-04-15') }
    ]
};

async function seedDatabase() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('[OK] Conectado ao MongoDB');

        // Limpar usuários e tarefas existentes
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('[OK] Banco de dados limpo');

        // Criar usuários
        const createdUsers = await User.insertMany(testUsers);
        console.log(`[OK] ${createdUsers.length} usuarios criados`);

        // Criar tarefas para cada usuário
        let totalTasks = 0;
        for (const user of createdUsers) {
            const userEmail = user.email;
            const userTasks = testTasks[userEmail] || [];
            
            if (userTasks.length > 0) {
                const tasksWithUser = userTasks.map(task => ({
                    ...task,
                    user: user._id
                }));
                
                await Task.insertMany(tasksWithUser);
                totalTasks += tasksWithUser.length;
                console.log(`[OK] ${tasksWithUser.length} tarefas criadas para ${user.name}`);
            }
        }

        console.log(`\n[OK] Database seeded com sucesso!`);
        console.log(`\nDados criados:`);
        console.log(`   - ${createdUsers.length} usuarios`);
        console.log(`   - ${totalTasks} tarefas`);
        console.log(`\nContas de teste:`);
        
        testUsers.forEach(user => {
            console.log(`   Email: ${user.email}`);
            console.log(`   Senha: ${user.password}\n`);
        });

        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Erro ao fazer seed do banco:', error.message);
        process.exit(1);
    }
}

seedDatabase();
