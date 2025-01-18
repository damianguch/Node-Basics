const dotenv = require('dotenv');
require('./strategies/local-strategy');
dotenv.config();
const passportRoute = require('./passport/passport.route');
const cartRoute = require('./routes/cart.route');
const passport = require('passport');
const homeRoute = require('./routes/home.route');
const authRoute = require('./routes/auth.route');
const adminRoute = require('./routes/admin.route');
const imageRoute = require('./routes/image.route');
const productRoute = require('./routes/product.route');
const bookRoute = require('./routes/book.route');
const authorRoute = require('./routes/author.route');
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
// Set the directory where the views are stored
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

app.use(passport.initialize());

// Using passport to manage sessions
// Attaches a dynamic user property to the request object
// req.user is the user object that passport deserializes
app.use(passport.session());

// Bind application-level middleware to an instance of
// the app object by using the app.use().
app.use('/api/home', homeRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/images', imageRoute);
app.use('/api/products', productRoute);
app.use('/api/books', bookRoute);
app.use('/api/authors', authorRoute);
app.use('/api/cart', cartRoute);
app.use(passportRoute);

app.get('/', (req, res) => {
  // Modify the session data object so that if cookie is not
  // expired or invalid, express-session will not generate new sessions
  req.session.visited = true;
  console.log(req.session);
  console.log(req.sessionID);

  res.render('index', { title: 'Home' });
});

// Check the status of the session authentication
app.get('/api/auth/status', (req, res) => {
  req.sessionStore.get(req.session.id, (err, session) => {
    if (err) {
      console.log(err);
      throw err;
    }

    console.log(session);
    console.log(req.session.id);
  });

  return req.session.auth
    ? res.status(200).json({ auth: true })
    : res.status(401).json({ auth: false, error: 'Not authenticated!' });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
