const express = require('express');
const router = express.Router({ mergeParams: true });

// middleware with no mount path that is specific to this router
const timeLogger = (req, res, next) => {
  console.log('Time: ', new Date().toISOString());
  next();
};

// Binding a router-level middleware to an instance of express.Router
router.use(timeLogger);

router.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(`${err.message}`);
});

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page');
});

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;
