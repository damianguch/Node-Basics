const Product = require('../models/product.model');
const { validationResult, matchedData } = require('express-validator');

let Products = [];

const getProductStats = async (req, res) => {
  try {
    const result = await Product.aggregate([
      // Stage 1: Filter by inStock and price >= 100
      {
        $match: {
          inStock: true,
          price: {
            $gte: 100
          }
        }
      },
      {
        // Stage 2: Group by category
        $group: {
          // The $group stage uses the category field as the grouping key.
          // category no longer exists as a separate field, its value
          // is stored in _id.
          _id: '$category',
          numProducts: {
            $sum: 1
          },
          avgPrice: {
            $avg: '$price'
          },
          totalRevenue: {
            $sum: '$price'
          }
        }
      },
      {
        // Stage 3: Project the fields
        $project: {
          _id: 0,
          category: '$_id', // Restore the category field
          numProducts: 1,
          avgPrice: {
            $round: ['$avgPrice', 2]
          },
          totalRevenue: {
            $round: ['$totalRevenue', 2]
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Product stats generated',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Some error occurred: ${err.message}`
    });
  }
};

const getProductAnalysis = async (req, res) => {
  try {
    const result = await Product.aggregate([
      // Stage 1: Match category 'Electronics'
      {
        $match: {
          category: 'Electronics'
        }
      },

      // Stage 2: Group by null
      {
        $group: {
          _id: null,
          avgPrice: {
            $avg: '$price'
          },
          minPrice: {
            $min: '$price'
          },
          maxPrice: {
            $max: '$price'
          },
          totalRevenue: {
            $sum: '$price'
          }
        }
      },

      // Stage 3: Project the fields
      {
        $project: {
          _id: 0,
          avgPrice: {
            $round: ['$avgPrice', 2]
          },
          minPrice: 1,
          maxPrice: 1,
          totalRevenue: {
            $round: ['$totalRevenue', 2]
          },
          priceRange: {
            $subtract: ['$maxPrice', '$minPrice']
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Product analysis generated',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Some error occurred: ${err.message}`
    });
  }
};

// @Desc Get products by category and price
// @Route GET /api/products
// @Access Public
const getProducts = async (req, res) => {
  try {
    const errors = validationResult(req);

    const {
      query: { category, price, name }
    } = req;

    // Build the query object dynamically
    let query = {};
    if (category) query.category = category;
    if (price) query.price = { $gt: parseInt(price) };
    if (name) query.name = { $regex: name, $options: 'i' };

    const products = await Product.find(query).select(
      'name category price inStock image'
    );

    // console.log(req.cookies);
    // console.log(req.signedCookies);
    // console.log(req.headers.cookie);

    console.log(req.session);
    console.log(req.sessionID);

    req.sessionStore.get(req.sessionID, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }

      console.log(sessionData);
    });

    if (!req.signedCookies.token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Access denied!'
      });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: ree.message
    });
  }
};

// @Desc Create a new product
// @Route POST /api/products
// @Access Public
const createProduct = async (req, res) => {
  const errors = validationResult(req);

  // Check for errors
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array().map((error) => error.msg) });
  }

  const data = matchedData(req);

  const newProduct = {
    id: Products.length > 0 ? Products[Products.length - 1].id + 1 : 1,
    ...data
  };

  Products.push(newProduct);
  res.status(201).json(newProduct);
};

const insertProduct = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 99.99,
        inStock: true,
        image: 'https://example.com/images/headphones.jpg',
        tags: ['audio', 'wireless', 'electronics']
      },
      {
        name: 'Running Shoes',
        category: 'Footwear',
        price: 79.99,
        inStock: true,
        image: 'https://example.com/images/shoes.jpg',
        tags: ['sports', 'running', 'comfort']
      },
      {
        name: 'Smartphone',
        category: 'Electronics',
        price: 699.99,
        inStock: false,
        image: 'https://example.com/images/smartphone.jpg',
        tags: ['mobile', 'smart', 'gadgets']
      },
      {
        name: 'Gaming Chair',
        category: 'Furniture',
        price: 199.99,
        inStock: true,
        image: 'https://example.com/images/gaming-chair.jpg',
        tags: ['furniture', 'gaming', 'ergonomics']
      },
      {
        name: 'Coffee Maker',
        category: 'Kitchen Appliances',
        price: 49.99,
        inStock: true,
        image: 'https://example.com/images/coffee-maker.jpg',
        tags: ['kitchen', 'coffee', 'appliances']
      },
      {
        name: 'Yoga Mat',
        category: 'Fitness',
        price: 25.99,
        inStock: true,
        image: 'https://example.com/images/yoga-mat.jpg',
        tags: ['fitness', 'yoga', 'exercise']
      },
      {
        name: 'Electric Scooter',
        category: 'Transportation',
        price: 299.99,
        inStock: false,
        image: 'https://example.com/images/electric-scooter.jpg',
        tags: ['eco-friendly', 'transportation', 'electric']
      },
      {
        name: 'Digital Camera',
        category: 'Photography',
        price: 499.99,
        inStock: true,
        image: 'https://example.com/images/camera.jpg',
        tags: ['photography', 'camera', 'electronics']
      },
      {
        name: 'Backpack',
        category: 'Accessories',
        price: 39.99,
        inStock: true,
        image: 'https://example.com/images/backpack.jpg',
        tags: ['travel', 'storage', 'fashion']
      },
      {
        name: 'Bluetooth Speaker',
        category: 'Electronics',
        price: 59.99,
        inStock: true,
        image: 'https://example.com/images/bluetooth-speaker.jpg',
        tags: ['audio', 'bluetooth', 'portable']
      }
    ];

    const result = await Product.insertMany(sampleProducts);
    res.status(201).json({
      success: true,
      message: `Inserted ${result.length} sample products`,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Some error occurred: ${err.message}`
    });
  }
};

module.exports = {
  insertProduct,
  getProductStats,
  getProductAnalysis,
  getProducts,
  createProduct
};
