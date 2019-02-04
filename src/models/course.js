const mongoose = require('mongoose')
const { Schema } = mongoose
var ObjectId = Schema.Types.ObjectId

const courseSchema = new Schema({
  cod: String,
  name: String,
  shedule: [ { start: Date, end: Date } ],
  students: [ ObjectId ],
  themes: [ { title: String, description: String, date: Date } ],
  activities: [ { title: String, percentage: Number, description: String, value: Number, date: Date } ],
  duration: { start: Date, end: Date },
  calification: [ { student: ObjectId, value: Number } ],
  typeCourse: String,
  typeNotes: String,
  description: String
})

module.exports = mongoose.model('courses', courseSchema)
