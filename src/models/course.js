const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    cod: String,
    username: String,
    name: String,
    typeCourse: String,
    typeNotes: String,
    description: String
});

module.exports = mongoose.model('courses', courseSchema);