const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Group = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupTeacher: {
    type: String,
    required: true,
  },
  groupDate: {
    type: String,
    required: true,
  },
});

const group = mongoose.model("Group", Group);
module.exports = group;
