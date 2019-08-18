module.exports = (text) => {
  if (typeof text !== 'string') return []

  return text.split(' ').map(str => str.toLowerCase())
}
