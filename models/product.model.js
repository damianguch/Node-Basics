const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    inStock: Boolean,
    image: String,
    tags: [String]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
