const { Customer } = require("../data/database");

const createCustomer = async (data) => {
  return await Customer.create(data);
};

const getAllCustomers = async () => {
  return await Customer.findAll();
};

const getCustomerById = async (id) => {
  return await Customer.findByPk(id);
};

const updateCustomer = async (id, data) => {
  const customer = await Customer.findByPk(id);
  if (!customer) return null;
  return await customer.update(data);
};

const deleteCustomer = async (id) => {
  const customer = await Customer.findByPk(id);
  if (!customer) return null;
  await customer.destroy();
  return true;
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
