const Product = require('../models/product.model');

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
  getProductAnalysis
};
