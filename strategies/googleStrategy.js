const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const Chat = require("../models/Chat");

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
        const { id, displayName, emails, photos } = profile;

        let user = await User.findOne({ email: emails[0].value });

        if (!user) {
          user = new User({
            firstName: displayName.split(" ")[0],
            lastName: displayName.split(" ")[1] || " ",
            email: emails[0].value,
            password: id,
            photo: photos[0]?.value || null,
          });

          await user.save();

          const predefinedChats = [
            { firstName: 'Андрій', lastName: 'Шевченко' },
            { firstName: 'Марія', lastName: 'Іванова' },
            { firstName: 'Олег', lastName: 'Ковальчук' },
          ];

          await Chat.insertMany(
            predefinedChats.map((chat) => ({
              ...chat,
              userId: user._id,
              messages: [],
            }))
          );
        } else {
          if (photos[0]?.value && user.photo !== photos[0].value) {
            user.photo = photos[0].value;
            await user.save();
          }
        }
        return done(null, user);
      } catch (err) {
        console.error("Error during Google Authentication:", err);
        return done(err, null);
      }
    }
  )
);
