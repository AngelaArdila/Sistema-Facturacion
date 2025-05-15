const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const { sequelize } = require('./database');

require('./models/customer.model');
require('./models/product.model');
require('./models/invoice.model');
require('./models/invoiceItem.model');

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
