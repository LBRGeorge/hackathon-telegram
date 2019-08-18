// Telegram API
const TelegramBot = require('node-telegram-bot-api')

// Database
const database = require('./database');

// Brain
const brain = require('./brain')

// Utils
const { Color } = require('./utils/constants')
const logger = require('./utils/logger')

class Telegram {
  init() {
    const { TELEGRAM_TOKEN } = process.env

    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })

    // User initialization
    this.bot.onText(/\/start/, async (msg) => {
      const { from } = msg
      const { id, first_name, last_name, username } = from

      try {
        const user = await database.createOrGetUser(first_name, last_name, username, id)
        
        // We are welcome
        await this.send(user, `Olá ${user.firstname}! Como posso ajuda-lo?`)

      } catch (error) {
        logger(error)
      }
    })

    this.bot.on('message', async (msg) => {
      const { from, text } = msg

      try {
        const user = await database.getUser(from.id)

        const response = await brain.find(user, text)
        this.send(user, response)
      } catch (error) {
        logger(error)
      }
    })
  }
  
  send(user, text, options = {}) {
    return this.bot.sendMessage(user.tg_id, text, options)
  }
}

module.exports = new Telegram()
