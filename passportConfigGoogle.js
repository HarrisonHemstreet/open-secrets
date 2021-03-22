const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// http://www.passportjs.org/packages/passport-google-oauth20/
// Define Goggle Passport Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //   use the profile info (mainly profile id) to check if the user is registered in your DB
      return done(null, profile);
  }
));