const { Router } = require("express");
const Student = require("../../models/student");

const router = Router();

router.get("/Student", async (req, res) => {
  const { userId } = req.decodedToken;
  const ownerId = userId
  try {
    const data = await Student.find({ownerId});
    if(data) {
      res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/Student", async (req, res) => {
  const { userId } = req.decodedToken;
  const { firstName, lastName, groupId, groupName, paidDate,sum } = req.body;
  const ownerId = userId

  const newUser = await Student.create({
    ownerId,
    firstName,
    lastName,
    existGroup: {
      groupId,
      groupName
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
