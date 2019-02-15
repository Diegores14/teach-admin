const mongoose = require('mongoose')
const { Schema } = mongoose
var ObjectId = Schema.Types.ObjectId

const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  Codigo: String,
  email: String,
  birthdate: Date,
  country: String,
  city: String,
  idDocent : ObjectId,
  courses: [ ObjectId ],
  School: String,
  photo: String // URL Where I'm going to store the image
})

module.exports = mongoose.model('students', studentSchema)