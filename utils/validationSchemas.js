const createProductSchema = {
  name: {
    in: ['body'],
    isLength: {
      errorMessage: 'Name must be atleast 3 - 20 xters',
      options: { min: 3, max: 20 }
    },
    notEmpty: {
      errorMessage: 'Name cannot be empty'
    },
    isString: {
      errorMessage: 'Name must be a string'
    }
  },
  price: {
    in: ['body'],
    isNumeric: true,
    errorMessage: 'Price must be a number'
  },
  category: {
    in: ['body'],
    isString: true,
    errorMessage: 'Category must be a string',
    notEmpty: {
      errorMessage: 'Category cannot be empty'
    }
  },
  inStock: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'inStock must be a boolean'
    }
  }
};

module.exports = {
  createProductSchema
};
