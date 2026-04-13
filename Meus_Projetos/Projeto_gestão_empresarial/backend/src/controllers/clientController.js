const { Client } = require('../models');

async function createClient(req, res) {
  try {
    const client = await Client.create(req.body);
    return res.status(201).json(client);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function listClients(req, res) {
  const clients = await Client.findAll({ order: [['id', 'DESC']] });
  return res.json(clients);
}

async function updateClient(req, res) {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: 'Cliente nao encontrado.' });
    }

    await client.update(req.body);
    return res.json(client);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function deleteClient(req, res) {
  const { id } = req.params;
  const client = await Client.findByPk(id);

  if (!client) {
    return res.status(404).json({ message: 'Cliente nao encontrado.' });
  }

  await client.destroy();
  return res.status(204).send();
}

module.exports = {
  createClient,
  listClients,
  updateClient,
  deleteClient
};
