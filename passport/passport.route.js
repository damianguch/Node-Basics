const express = require('express');
const passport = require('passport');

const { Router } = express;
const router = Router();

// Using the callback version of passport.authenticate()
// passport.authenticate() does not handle errors or customization
// by default. Its default response is 401 Unauthorized.
router.use('/api/authenticate', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('Authentication error: ', err);
      return res.status(401).json({ error: err });
    }

    if (!user) {
      return res.status(401).json({ error: info.error });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      return res.status(200).json({ message: 'Authenticated', user });
    });
  })(req, res, next);
});

// Logout using passport logout method
router.post('/api/auth/logout', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User Unauthenticated' });
  }

  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Logout error' });
    }

    return res.status(200).json({ message: 'User logged out' });
  });
});

// Check the status of the passport session
router.get('/api/auth/passport-status', (req, res) => {
  console.log('Inside passport-status');
  console.log(req.user);

  // Passport modifies the session object by
  // adding the user object to it
  console.log(req.session);

  return req.user
    ? res.status(200).json({ auth: true, user: req.user })
    : res.status(401).json({ auth: false });
});

router.get('/api/auth/discord', passport.authenticate('discord'));

// Calling authenticate again, takes the code on the url and exchange
// it for accessToken and refreshToken, and calls the verify function
router.get(
  '/api/auth/discord/redirect',
  passport.authenticate('discord'),
  (req, res) => {
    console.log(req.session);
    console.log(req.user);
    res.sendStatus(200);
  }
);

module.exports = router;
