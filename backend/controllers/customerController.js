const customerService = require('../services/customerService');

const createCustomer = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: 'Nombre y dirección son requeridos' });
    }

    if (phone && (!/^[0-9]{10}$/.test(phone))) {
      return res.status(400).json({ error: 'El teléfono debe tener 10 dígitos numéricos' });
    }

    const customer = await customerService.createCustomer({ name, address, phone });
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error al crear cliente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);
    if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await customerService.updateCustomer(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await customerService.deleteCustomer(id);
    if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
