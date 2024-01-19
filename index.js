const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const bodyParser = require("body-parser");
const { authToken } = require("./middlewares/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoUrl = process.env.MONGOURL;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/api", require("./controllers/users/index"));

app.use(authToken);

app.get("/me", (req, res) => {
  res.send(
    `Protected route accessed by user with ID ${req.decodedToken.userId}`
  );
});
app.use("/api", require("./controllers/students/index"));

app.listen(3000);
