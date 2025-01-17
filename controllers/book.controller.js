const Book = require('../models/book.model');
const Author = require('../models/author.model');

// #Desc Create a new book
// #Route POST /api/books
// #Access Public
const createBook = async (req, res) => {
  try {
    const { title, year, pages, bio, authorName, authorEmail } = req.body;

    if (!title || !year || !pages || !bio || !authorName || !authorEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Find the author by email
    let author = await Author.findOne({ email: authorEmail });

    // If the author does not exist, create a new author
    if (author === null) {
      author = new Author({
        name: authorName,
        email: authorEmail,
        bio
      });

      await author.save();
    }

    // Create a new book
    const book = new Book({
      title,
      year,
      pages,
      author: author._id
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.stack
    });
  }
};

// @Desc Get a single book
// @Route GET /api/books/:id
// @Access Public
const getBook = async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId))
      return res
        .status(400)
        .json({ sucess: false, error: 'Bad request. Inavlid Id' });

    const book = await Book.findById(parsedId)
      .populate({ path: 'author', select: 'name email bio -_id' })
      .exec();

    if (book === null) {
      const err = new Error('Book not found');
      err.status = 404;
      return res.status(err.status).json({
        success: false,
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  createBook,
  getBook
};
