const { Customer, InvoiceItem, Invoice, Product } = require("../data/database");

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
      ProductId: item.productId,
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
      CustomerId: customerId,
      subtotal,
      tax,
      total,
      invoiceItems,
    },
    {
      include: [
        {
          model: InvoiceItem,
          as: "invoiceItems",
        },
      ],
    }
  );
  const savedInvoice = await getInvoiceById(invoice.id);

  return savedInvoice;
};

const getAllInvoices = async () => {
  return await Invoice.findAll({
    include: [
      {
        model: Customer,
        as: "customer",
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getInvoiceById = async (id) => {
  return await Invoice.findByPk(id, {
    include: [
      {
        model: Customer,
        as: "customer",
      },
      {
        model: InvoiceItem,
        as: "invoiceItems",
        include: [{ model: Product, as: "product" }],
      },
    ],
  });
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
