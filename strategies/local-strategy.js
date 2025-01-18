const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
  console.log('Inside Serialize user');
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Inside Deserializer');
  console.log('Deserializing userId: ', id);

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { error: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { error: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
