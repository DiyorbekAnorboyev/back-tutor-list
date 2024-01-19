const { Router } = require("express");
const Student = require("../../models/student");

const router = Router();

router.get("/Student", function (req, res) {
  const { userId } = req.decodedToken;
  try {
    res.send(userId);
  } catch (error) {
    res.send(error);
  }
});

router.post("/Student", async (req, res) => {
  const { userId } = req.decodedToken;
  const { email, password, tutorName } = req.body;

  const id = 123

  const newUser = await Student.create({
    userId,
    firstName,
    lastName,
    existGroup: {
      id,
      groupName,
    },
    paid: {
      paidDate,
      sum
    }
  });

  await newUser.save();

  res.send("Create");
});

module.exports = router;
