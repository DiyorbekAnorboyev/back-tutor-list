const { Router } = require("express");
const Group = require("../../models/Group");

const router = Router();

router.get("/Group", async (req, res) => {
  const { userId } = req.decodedToken;
  const ownerId = userId;
  try {
    const data = await Group.find({ ownerId });
    if (data) {
      res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/Group", async (req, res) => {
  const { userId } = req.decodedToken;
  const { groupName, groupTeacher, groupDate } = req.body;

  const newGroup = await Group.create({
    ownerId: userId,
    groupName,
    groupTeacher,
    groupDate,
  });

  await newGroup.save();

  res.send("Create");
});

router.delete("/oneGroupDelete/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await Group.findByIdAndDelete({ _id });
    if (data) {
      res.send("Sucess deleted");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/Group/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await Group.findById(_id);
    if (data) {
      res.status(200).json(data.groupName);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
