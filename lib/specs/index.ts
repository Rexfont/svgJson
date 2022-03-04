import {multiDotSync} from './multiDot'
import multiCommand from './multiCommand'

export default function specs(value) {
  return multiDotSync(value)
  .then(resolved => multiCommand(resolved))
}
