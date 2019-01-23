const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    firstName: String,
    lastName: String,
    Codigo: String,
    email: String,
    birthdate: Date,
    country: String,
    city: String,
    courses: [ ObjectId ],
    School: String,
    photo: String                   // URL Where I'm going to store the image
});