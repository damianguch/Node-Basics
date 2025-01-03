const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const homeRoute = require('./routes/home.route');
const authRoute = require('./routes/auth.route');
const adminRoute = require('./routes/admin.route');
const imageRoute = require('./routes/image.route');
const productRoute = require('./routes/product.route');
const path = require('path');
const connectDB = require('./database/db');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
// Set the directory where the views are stored
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Bind application-level middleware to an instance of
// the app object by using the app.use().
app.use('/api/home', homeRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/images', imageRoute);
app.use('/api/products', productRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
