const express = require('express');
const { Router } = express;

const router = Router();

// @Desc Add an item to the cart
// @Route POST /api/cart
// @Access Private
router.post('/', (req, res) => {
  if (!req.session.auth)
    return res.status(401).json({ error: 'Not authenticated!' });

  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  return res.status(201).send(cart);
});

// @Desc Get all items in the cart
// @Route GET /api/cart
// @Access Private
router.get('/', (req, res) => {
  if (!req.session.auth)
    return res.status(401).json({ error: 'Not authenticated!' });

  const { cart } = req.session;

  return res.status(200).send(cart ?? []);
});

module.exports = router;
