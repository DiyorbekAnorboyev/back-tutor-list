const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Student = new Schema({
  ownerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  existGroup: {
    groupId: { type: String, required: true },
  },
  paid: {
    paidDate: { type: Date },
    sum: { type: String },
  },
});

const student = mongoose.model("Student", Student);
module.exports = student;
