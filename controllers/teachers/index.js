const { Router } = require("express");
const Teacher = require("../../models/teacher");

const router = Router();

router.get("/Teacher", async (req, res) => {
  const { userId } = req.decodedToken;
  const ownerId = userId;
  try {
    const data = await Teacher.find({ ownerId });
    if (data) {
      res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/Teacher", async (req, res) => {
  const { userId } = req.decodedToken;
  const { firstName, lastName, tutorName } = req.body;

  const newTeacher = await Teacher.create({
    ownerId: userId,
    firstName,
    lastName,
    tutors: { tutorName },
  });

  await newTeacher.save();

  res.send("Create");
});

router.get("/oneTeacher/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Teacher.findOne({ id });
    if (data) {
      res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
});

router.delete("/oneTeacherDelete/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await Teacher.findByIdAndDelete({ _id });
    if (data) {
      res.send("Sucess deleted");
    }
  } catch (error) {
    res.send(error);
  }
});

//edit
router.put("/oneTeacher/:id", async (req, res) => {
  const { firstName, lastName, tutorName } = req.body;
  const newTeacher = {
    firstName,
    lastName,
    tutorName,
  };
  const updateTeacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    newTeacher
  );
  res.send({ msg: "Success Updated", updateTeacher });
});

module.exports = router;
