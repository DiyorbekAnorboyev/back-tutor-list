const { Router } = require("express");
const Users = require("../../models/User");
const { createToken } = require("../../utils/jwtCreateFunction");

const router = Router();

router.get("/User", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await Users.findOne(email, password);
    if (!data) {
      res.send("User not exsit");
    }
    const token = createToken(data._id);
    res.send(`token:"${token}"`);
  } catch (error) {
    res.send(error);
  }
});

router.post("/User", async (req, res) => {
  const { email, password, tutorName } = req.body;

  const newUser = await Users.create({
    email,
    password,
    tutorName,
  });

  await newUser.save();

  res.send("Create");
});

router.get("/me", async (req, res) => {

  const newUser = await Users.create({
    email,
    password,
    tutorName,
  });

  await newUser.save();

  res.send("Create");
});

module.exports = router;
