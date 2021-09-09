const express = require("express");
const cors = require("cors");

const db = require("./models");

const authRoutes = require("./routes/auth");
const isAuth = require("./middlewares/is-auth");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use(cors());

// Routes middleware
app.get("/", (req, res, next) => {
  res.status(200).json("Welcome to the server side of Mantagi!");
});

app.use("/api/is-auth", isAuth);

app.use("/api/auth", authRoutes);
// app.use("/api/auth/register", (req, res, next) => {
//   res.status(200).json("Test");
// });

// Errors middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

db.sequelize
  .sync()
  .then(() => {
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
