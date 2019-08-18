// Mongoose schema struct
const { Schema } = require('mongoose')

module.exports = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  tg_id: Number
})
