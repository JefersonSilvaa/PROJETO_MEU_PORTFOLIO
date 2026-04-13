const { Product } = require('../models');

async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function listProducts(req, res) {
  const products = await Product.findAll({ order: [['id', 'DESC']] });
  return res.json(products);
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado.' });
    }

    await product.update(req.body);
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ message: 'Produto nao encontrado.' });
  }

  await product.destroy();
  return res.status(204).send();
}

module.exports = {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct
};
