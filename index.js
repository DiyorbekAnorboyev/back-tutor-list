const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

const mongoUrl = process.env.MONGOURL;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json())

app.use("/api",require('./controllers/users/index'));
app.use("/api",require('./controllers/students/index'));



app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Unauthorized: Missing Authorization header");
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
    return res.status(401).send("Unauthorized: Invalid Authorization header format");
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.decodedToken = decoded;

    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
});


app.get("/me", (req, res) => {
  const decodedToken = req.decodedToken;
  res.send(`Protected route accessed by user with ID ${decodedToken.userId}`);
});


app.listen(3000);
