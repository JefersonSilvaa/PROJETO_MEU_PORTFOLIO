const express = require('express');
const {
	createSale,
	listSales,
	clearSales,
	clearAllData
} = require('../controllers/saleController');

const router = express.Router();

router.post('/', createSale);
router.get('/', listSales);
router.delete('/limpar', clearSales);
router.delete('/limpar-tudo', clearAllData);

module.exports = router;
