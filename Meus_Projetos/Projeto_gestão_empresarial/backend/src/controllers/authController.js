const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function login(req, res) {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Configuracao de seguranca invalida.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha sao obrigatorios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao realizar login.' });
  }
}

module.exports = {
  login
};
