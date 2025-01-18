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

const createUserSchema = {
  username: {
    in: ['body'],
    isLength: {
      errorMessage: 'Username must be atleast 3 - 20 xters',
      options: { min: 3, max: 20 }
    },
    notEmpty: {
      errorMessage: 'Username cannot be empty'
    },
    isString: {
      errorMessage: 'Username must be a string'
    }
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email must be a valid email address'
    }
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password must be atleast 6 - 20 xters',
      options: { min: 6, max: 20 }
    },
    notEmpty: {
      errorMessage: 'Password cannot be empty'
    },
    isString: {
      errorMessage: 'Password must be a string'
    }
  }
};

module.exports = {
  createProductSchema,
  createUserSchema
};
