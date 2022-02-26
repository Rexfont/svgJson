const multiDot = require('./multiDot')
const multiCommand = require('./multiCommand')
const tools = require('../helpers/tools')

function specs(value) {
  let resolved = multiDot.multiDot(value)
  resolved = multiCommand(resolved)
  return resolved
}

module.exports = specs
