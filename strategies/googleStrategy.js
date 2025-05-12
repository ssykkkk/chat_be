const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;

        let user = await User.findOne({ email: emails[0].value });

        if (!user) {
          user = new User({
            firstName: displayName.split(" ")[0],
            lastName: displayName.split(" ")[1] || " ",
            email: emails[0].value,
            password: id,
          });

          await user.save();
        }
        return done(null, user);
      } catch (err) {
        console.error("Error during Google Authentication:", err);
        return done(err, null);
      }
    }
  )
);