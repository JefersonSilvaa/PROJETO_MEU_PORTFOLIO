const sequelize = require('../config/database');
const { Client, Product, Sale, SaleItem } = require('../models');
const { sendSaleSummary } = require('./emailService');

async function createSaleWithTransaction(payload) {
  const { clientId, items } = payload;

  if (!clientId || !Array.isArray(items) || items.length === 0) {
    throw new Error('Cliente e itens sao obrigatorios.');
  }

  return sequelize.transaction(async (transaction) => {
    const client = await Client.findByPk(clientId, { transaction });

    if (!client) {
      throw new Error('Cliente nao encontrado.');
    }

    let total = 0;
    const saleItemsPayload = [];
    const emailItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });

      if (!product) {
        throw new Error(`Produto ${item.productId} nao encontrado.`);
      }

      const quantity = Number(item.quantity || 0);
      if (quantity <= 0) {
        throw new Error('Quantidade invalida para o item da venda.');
      }

      if (product.stock < quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}.`);
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;
      total += subtotal;

      saleItemsPayload.push({
        productId: product.id,
        quantity,
        unitPrice,
        subtotal
      });

      emailItems.push({
        productName: product.name,
        quantity,
        subtotal
      });

      await product.update({ stock: product.stock - quantity }, { transaction });
    }

    const sale = await Sale.create(
      {
        clientId,
        total
      },
      { transaction }
    );

    const saleItemsWithSaleId = saleItemsPayload.map((item) => ({ ...item, saleId: sale.id }));
    await SaleItem.bulkCreate(saleItemsWithSaleId, { transaction });

    await sendSaleSummary(client, sale, emailItems);

    return sale;
  });
}

async function clearSalesHistory() {
  return sequelize.transaction(async (transaction) => {
    const saleItems = await SaleItem.findAll({
      include: [{ model: Product }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    for (const item of saleItems) {
      if (item.Product) {
        await item.Product.update(
          { stock: Number(item.Product.stock) + Number(item.quantity) },
          { transaction }
        );
      }
    }

    const removedItems = await SaleItem.destroy({ where: {}, transaction });
    const removedSales = await Sale.destroy({ where: {}, transaction });

    return { removedSales, removedItems };
  });
}

async function clearAllBusinessData() {
  return sequelize.transaction(async (transaction) => {
    const removedItems = await SaleItem.destroy({ where: {}, transaction });
    const removedSales = await Sale.destroy({ where: {}, transaction });
    const removedClients = await Client.destroy({ where: {}, transaction });
    const removedProducts = await Product.destroy({ where: {}, transaction });

    return { removedSales, removedItems, removedClients, removedProducts };
  });
}

module.exports = {
  createSaleWithTransaction,
  clearSalesHistory,
  clearAllBusinessData
};
