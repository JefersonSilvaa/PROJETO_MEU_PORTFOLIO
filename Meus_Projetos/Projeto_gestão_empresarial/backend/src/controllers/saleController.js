const { Sale, SaleItem, Product, Client } = require('../models');
const {
  createSaleWithTransaction,
  clearSalesHistory,
  clearAllBusinessData
} = require('../services/saleService');

async function createSale(req, res) {
  try {
    const sale = await createSaleWithTransaction(req.body);
    return res.status(201).json(sale);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function listSales(req, res) {
  const sales = await Sale.findAll({
    include: [
      { model: Client, attributes: ['id', 'name', 'email'] },
      {
        model: SaleItem,
        include: [{ model: Product, attributes: ['id', 'name'] }]
      }
    ],
    order: [['id', 'DESC']]
  });

  return res.json(sales);
}

async function clearSales(req, res) {
  try {
    const result = await clearSalesHistory();
    return res.json({ message: 'Historico de vendas limpo com sucesso.', ...result });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao limpar vendas.' });
  }
}

async function clearAllData(req, res) {
  try {
    const result = await clearAllBusinessData();
    return res.json({ message: 'Dados de teste limpos com sucesso.', ...result });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao limpar todos os dados.' });
  }
}

module.exports = {
  createSale,
  listSales,
  clearSales,
  clearAllData
};
