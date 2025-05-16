require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

connectDB();
const corsOptions = {
  origin: "https://chat-kozak.netlify.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

require("./strategies/googleStrategy");

app.use("/chats", chatRoutes);
app.use("/user", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

