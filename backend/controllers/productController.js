const productService = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price == null) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    const exists = await productService.findByName(name);
    if (exists) {
      return res.status(409).json({ error: 'El nombre del producto ya existe' });
    }

    const product = await productService.createProduct({ name, description, price });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
