const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    pages: {
      type: Number,
      required: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Author'
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
