const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/google/callback",
      scope: ["profile", "email"],
    },
    async (profile, done) => {
      const { id, displayName, emails } = profile;
      const nameParts = displayName.split(" ");

      try {
        let user = await User.findOne({ email: emails[0].value });

        if (!user) {
          user = new User({
            firstName: nameParts[0],
            lastName: nameParts[1] ? nameParts[1] : " ",
            email: emails[0].value,
            password: id,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Помилка при авторизації через Google:", err.message);
        return done(err, null);
      }
    }
  )
);
