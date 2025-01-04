const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    bio: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
