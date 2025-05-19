const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;


const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoute');
const invoiceRoutes = require('./routes/invoiceRoute');
const { sequelize } = require('./data/database');

require('./models/customerModel');
require('./models/productModel');
require('./models/invoiceModel');
require('./models/invoiceItemModel');

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
