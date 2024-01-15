const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Teacher = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
    },
    tutors: [
        id,
        tutorName
    ],
})

const teacher = mongoose.model('Teacher', Teacher)
module.exports = teacher