const passport = require('passport');
const { Strategy } = require('passport-discord');
const DiscordUser = require('../models/discord-user');

// Serializes the use into the session object
// The user object is passed to the done callback
// done callback saves the user in the session
// Cookie is sent to the browser with the user id
passport.serializeUser((user, done) => {
  console.log('Inside Serialize user');
  console.log(user);
  done(null, user._id);
});

// Deserializes the user from the session object
// The user id is passed to the done callback
// done callback retrieves the user from the database
// and saves the user in the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await DiscordUser.findById(id);
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

// verify callback validates the user trying to authenticate
passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ['identify', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      // verify callback
      try {
        const user = await DiscordUser.findOne({ discordId: profile.id });
        if (!user) {
          const newUser = new DiscordUser({
            discordId: profile.id,
            username: profile.username
          });

          const savedUser = await newUser.save();
          return done(null, savedUser);
        }

        // This will call the serialize user fxn
        // Pass the user object to the serialize user fxn
        // and save the user in the session
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
