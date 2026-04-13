const express = require('express');
const {
  createClient,
  listClients,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

const router = express.Router();

router.post('/', createClient);
router.get('/', listClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
