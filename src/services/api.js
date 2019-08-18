const { create } = require('apisauce')

// Envs
const { JFRN_API } = process.env

const api = create({
  baseURL: JFRN_API
})

// Methods
const getMessages = () => api.get(`faleconoscoapi`)
const getServices = () => api.get(`cartaapi/servicos`)

module.exports = {
  getMessages,
  getServices
}
