const mongoose = require('mongoose');
const Product = require('../models/Product');
const mockStore = require('../data/mockStore');

/**
 * @desc    Fetch all products with filtering, search, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    // Use mockStore if MongoDB is offline
    if (mongoose.connection.readyState !== 1) {
      const data = mockStore.getProducts({
        keyword,
        category,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
      });
      return res.json({
        success: true,
        ...data,
      });
    }

    // Build MongoDB filter query object
    const query = {};

    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (!isNaN(min)) query.price.$gte = min;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (!isNaN(max)) query.price.$lte = max;
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'rating') {
      sortOptions = { rating: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all distinct product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        categories: mockStore.getCategories(),
      });
    }

    const categories = await Product.distinct('category');
    res.json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const product = mockStore.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      return res.json({
        success: true,
        product,
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, image, stock',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const product = mockStore.createProduct({
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock),
      });
      return res.status(201).json({
        success: true,
        message: 'Product created successfully (In-Memory Preview)',
        product,
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = mockStore.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      return res.json({
        success: true,
        message: 'Product updated successfully',
        product: updated,
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { name, description, price, category, image, stock, rating } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const deleted = mockStore.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      return res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
