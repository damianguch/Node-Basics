const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
// Load the birds router module in the app
const birds = require('./birds');
const homeRoute = require('./routes/home.route');
const authRoute = require('./routes/auth.route');
const adminRoute = require('./routes/admin.route');
const imageRoute = require('./routes/image.route');
const path = require('path');
const connectDB = require('./db/db');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
// Set the directory where the views are stored
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Bind application-level middleware to an instance of
// the app object by using the app.use() and app.METHOD() functions.
app.use('/birds', birds);
app.use('/api/home', homeRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/image', imageRoute);

const products = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Smartphone', price: 500 },
  { id: 3, name: 'Tablet', price: 300 },
  { id: 4, name: 'Deskjet Printer', price: 800 }
];

app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page', products: products });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
