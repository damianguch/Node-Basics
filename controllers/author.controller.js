const Author = require('../models/author.model');

const createAuthor = async (req, res) => {
  try {
    const { name, bio, email } = req.body;

    if (!name || !bio || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const author = new Author(req.body);
    await author.save();

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: author
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  createAuthor
};
