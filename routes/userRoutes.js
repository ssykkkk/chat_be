const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, refresh, logout } = require("../controllers/userController");
require("../strategies/googleStrategy");
const authenticateToken = require("../middlewares/authToken");
const User = require("../models/User");

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -__v");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});
const bcrypt = require("bcryptjs");

router.put("/profile", authenticateToken, async (req, res) => {
  const { firstName, lastName, email, photo, password } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (photo) user.photo = photo;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      photo: updatedUser.photo,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        photo: req.user.photo,
        userId: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`https://chat-kozak.netlify.app/home?token=${token}`);
  }
);

module.exports = router;
