// Get messages
const { getMessages } = require('./services/api')

// Helpers
const tokenizer = require('./helpers/tokenizer')

class Brain {
  /**
   * Get best match
   * 
   * @param {Object} user
   * @param {String} setence 
   * @return {Object}
   */
  async find(user, setence) {
    const response = await getMessages()
    const { ok, data, problem } = response

    if (ok) {
      let tokens = tokenizer(setence)
      tokens.filter((item, index) => {
        return tokens.indexOf(item) == index
      })
      let results = []

      // Limit of tokens to find match
      if (tokens.length < 4) return 'Por favor, formule sua pergunta para que eu possa ajuda-lo.'

      // Parse data
      const parsed = data.filter(p => p.resposta).map(p => {
        const { id, mensagem, resposta } = p
        const _tokens = tokenizer(mensagem)

        return {
          id,
          mensagem,
          resposta,
          _tokens
        }
      })

      tokens.forEach(token => {
        const matches = parsed.filter(p => p._tokens.indexOf(token) !== -1)

        matches.forEach(match => {
          if (match) {
            const index = results.findIndex(p => p.id === match.id)
    
            if (index === -1) {
              match.score = 1
              match.tokens_match = [token]
              results.push(match)
            } else {
              results[index].score++
              match.tokens_match.push(token)
            }
          }
        })
      })

      const _result = results.sort((a, b) => b.score - a.score)[0]

      if (_result) {
        let { resposta } = _result
        //console.log(_result)
        if (resposta.indexOf('{nome}') < resposta.length - String('{nome}').length) {
          resposta = resposta.replace('{nome}', user.firstname)
        } else {
          resposta = resposta.replace('{nome}', '')
        }

        return resposta
      } else {
        return 'Desculpe, não achei uma resposta para você. Poderia ser mais claro por favor?'
      }
    } else {
      throw problem
    }
  }
}

module.exports = new Brain()
