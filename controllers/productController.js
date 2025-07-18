const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    // Create a new product using model
    const product = await Product.create(req.body);

    //Send created product as response
    res.status(201).json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // If product not found, return 404 status code
    if (!product) {
      // Return 404 status code with message
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Send the product as response
    res.json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Get product ID from request parameters
    const productId = req.params.id;

    //update the product using findByIdAndUpdate method
    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    // If product not found, return 404 status code
    if (!product) {
      // Return 404 status code with message
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Send the updated product as response
    res.json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Get product  from request parameters
    const productId = req.params.id;

    //Delete the product using findByIdAndDelete method
    const product = await Product.findByIdAndDelete(productId);

    // If product not found, return 404 status code
    if (!product) {
      // Return 404 status code with message
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Send sucess msg in  response
    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
