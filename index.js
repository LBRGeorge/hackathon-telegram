// Load envs
require('dotenv').config()

// Main app
const App = require('./src/app')

module.exports = new App().init()
