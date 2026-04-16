const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const clientRoutes = require('./clientRoutes');
const saleRoutes = require('./saleRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/produtos', authMiddleware, productRoutes);
router.use('/clientes', authMiddleware, clientRoutes);
router.use('/vendas', authMiddleware, saleRoutes);

module.exports = router;
