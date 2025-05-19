const invoiceService = require('../services/invoiceService');

const createInvoice = async (req, res) => {
  try {
    const { customerId, items } = req.body;
    if (!customerId || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Cliente e ítems son requeridos' });
    }

    const invoice = await invoiceService.createInvoice({ customerId, items });

    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error al crear factura:', err);
    res.status(400).json({ error: err.message || 'Error al crear factura' });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener facturas', err });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener factura', err });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
