// Database
const database = require('./database')

// Telegram wrapper
const telegram = require('./telegram')

const { getServices } = require('./services/api')

// Utils
const { Color } = require('./utils/constants')
const logger = require('./utils/logger')

class App {
  /**
   * Initialize application
   */
  async init() {
    try {
      // Initialize database
      await database.init()
      logger('Database initialized!', Color.FgCyan)

      // Initialize telegram
      await telegram.init()
      logger('Telegram initialized!', Color.FgCyan)

      //const test = await getServices()
      //console.log(test.data.filter(p => p.cidadao === true))

    } catch (error) {
      if (error.name && error.name === 'MongoNetworkError') {
        logger('Database not ready. Retrying...', Color.FgRed)

        setTimeout(() => {
          this.init()
        }, 5000)
      } else {
        logger(error, Color.FgRed)
      }
    }
  }
}

module.exports = App

