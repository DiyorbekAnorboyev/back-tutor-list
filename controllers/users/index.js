const { Router } = require("express");
const Users = require("../../models/User");
const { createToken } = require("../../utils/jwtCreateFunction");

const router = Router();

router.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await Users.findOne({ email, password });
    if (!data) {
      res.status(404).send("Not Found")
      // res.send("Email or password wrong");
    }
    if (data) {
      const token = createToken(data._id);
      res.send(token);
    }
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

router.delete("/oneUserDelete/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await Users.findByIdAndDelete({ _id });
    if (data) {
      res.send("Sucess deleted");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
