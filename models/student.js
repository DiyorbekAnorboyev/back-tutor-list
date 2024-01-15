const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Student = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  existGroup: [
    {
      id, //group id
      groupName, //group name
    },
  ],
  paid: [
    {
      paidDate,
      sum
    },
  ],
});

const student = mongoose.model("Student", Student);
module.exports = student;
