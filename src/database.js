// Mongoose
const mongoose = require('mongoose')

// Models schemas
const UserModel = require('./models/user.model')

class Database {
  init() {
    const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASS } = process.env

    return new Promise(async(resolve, reject) => {
      try {
        await mongoose.connect(`mongodb://${DATABASE_HOST || 'localhost'}:${DATABASE_PORT || 27017}/${DATABASE_NAME || 'db'}`, {
          useNewUrlParser: true,
          user: DATABASE_USER,
          pass: DATABASE_PASS
        })

        this.db = mongoose.connection

        this.db.on('error', (error) => {
          reject(error)
        })

        // Define models schemas
        this.user = mongoose.model('User', UserModel)

        await this.user.syncIndexes()

        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Create a new user
   * 
   * @param {String} firstname 
   * @param {Strig} lastname 
   * @param {String} username
   * @param {Number} tg_id 
   * @return {Promise<UserModel>}
   */
  createOrUpdateUser(firstname, lastname, username, tg_id) {
    return new Promise((resolve, reject) => {
      this.user.findOne({
        username: username.toLowerCase()
      }, (err, doc) => {
        if (err) reject(err)
        else if (doc) {
          return doc.update({
            firstname,
            lastname
          })
        } else {
          this.user.create({
            firstname,
            lastname,
            username,
            tg_id
          }).then(user => {
            resolve(user)
          }, err => reject(err))
        }
      })
    })
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      this.user.findOne({
        tg_id: id
      }, (err, doc) => {
        if (err) reject(err)
        else resolve(doc)
      })
    })
  }
}

module.exports = new Database()
