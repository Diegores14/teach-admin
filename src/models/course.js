const mongoose = require('mongoose')
const { Schema } = mongoose
var ObjectId = Schema.Types.ObjectId

const courseSchema = new Schema({
  cod: String,
  name: String,
  shedule: [ { Day: String, HI: String, HF: String, students: [ObjectId] } ],
  students: [ ObjectId ],
  themes: [ { title: String, description: String, date: Date } ],
  activities: [ 
    { 
      title: String,
      theme : String,
      percentage: Number,
      description: String,
      date: Date,
      grades: [[ObjectId, Number]] //Ese ObjectId es el codigo del estudiante al que se le asignara la nota
    } ],
  duration: { start: Date, end: Date },
  calification: [ { student: ObjectId, value: Number } ],
  typeCourse: String,
  typeNotes: String,
  description: String
})

module.exports = mongoose.model('courses', courseSchema)
