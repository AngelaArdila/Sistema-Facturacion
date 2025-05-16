const Invoice = require("../models/invoiceModel");
const InvoiceItem = require("../models/invoiceItemModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const { Op } = require("sequelize");

const generateInvoiceNumber = async () => {
  const count = await Invoice.count();
  return `INV-${(count + 1).toString().padStart(5, "0")}`;
};

const createInvoice = async ({ customerId, items }) => {
  if (!items || items.length === 0)
    throw new Error("Debe haber al menos un ítem");

  let subtotal = 0;
  const invoiceItems = [];

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product)
      throw new Error(`Producto con ID ${item.productId} no encontrado`);

    const totalPrice = product.price * item.quantity;
    subtotal += totalPrice;

    invoiceItems.push({
      productId: item.productId,
      quantity: item.quantity,
      totalPrice,
    });
  }

  const tax = parseFloat((subtotal * 0.15).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await Invoice.create(
    {
      invoiceNumber,
      customerId,
      subtotal,
      tax,
      total,
      InvoiceItems: invoiceItems,
    },
    {
      include: [{ model: InvoiceItem }],
    }
  );
  const savedInvoice = await getInvoiceById(invoice.id);
  return savedInvoice;
};

const getAllInvoices = async () => {
  return await Invoice.findAll({
    include: [{ model: Customer }, { model: InvoiceItem, include: [Product] }],
    order: [["createdAt", "DESC"]],
  });
};

const getInvoiceById = async (id) => {
  return await Invoice.findByPk(id, {
    include: [{ model: Customer }, { model: InvoiceItem, include: [Product] }],
  });
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
