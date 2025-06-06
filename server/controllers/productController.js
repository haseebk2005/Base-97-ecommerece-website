
const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (err) {
    console.error('❌ getProducts error:', err);
    return res.status(500).json({ message: err.message });
  }
};


exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.update(req.body);
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.destroy();
  res.json({ message: 'Deleted' });
};
