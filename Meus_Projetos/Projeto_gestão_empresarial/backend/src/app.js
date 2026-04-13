const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
require('dotenv').config();

const routes = require('./routes');
const sequelize = require('./config/database');
const { User } = require('./models');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    if (allowedOrigins.includes(origin)) return true;

    if (!isProduction && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('Origem nao permitida pelo CORS'));
  }
};

app.disable('x-powered-by');
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '200kb' }));

app.get('/health', (req, res) => {
  return res.json({ status: 'ok', service: 'backend' });
});

app.use('/api', routes);

async function bootstrap() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET nao configurado.');
    }

    await sequelize.authenticate();
    await sequelize.sync();

    const shouldSeedAdmin = process.env.SEED_ADMIN === 'true' || !isProduction;
    if (shouldSeedAdmin) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@empresa.com';
      const adminPassword = process.env.ADMIN_PASSWORD || '123456';
      const existingAdmin = await User.findOne({ where: { email: adminEmail } });

      if (!existingAdmin) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await User.create({ name: 'Administrador', email: adminEmail, password: hash });
      }
    }

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Servidor backend rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar backend:', error.message);
    process.exit(1);
  }
}

bootstrap();
