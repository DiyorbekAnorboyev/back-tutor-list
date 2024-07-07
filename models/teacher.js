const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectIdSchema = Schema.ObjectId;
const ObjectId = require('mongoose').Types.ObjectId; // use you logic to generate the _id

const Teacher = new Schema({
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
  tutors: {
    _id: {type:ObjectIdSchema, default: new ObjectId()},
    tutorName: { type: String },
  },
});

const teacher = mongoose.model("Teacher", Teacher);
module.exports = teacher;
