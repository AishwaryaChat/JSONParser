const nullParser = input => input.startsWith('null') ? [null, input.slice(4)] : null
const boolParser = input => input.startsWith('true') ? ['true', input.slice(4)] : (input.startsWith('false') ? ['false', input.slice(5)] : null)
const commaParser = input => input.startsWith(',') ? [',', input.slice(1)] : null
const colonParser = input => input.startsWith(':') ? [':', input.slice(1)] : null
const spaceParser = input => input.match(/^[\s\n]/) ? [null, input.slice(input.match(/\S/).index)] : null

function stringParser (input) {
  let i = 1
  if (input.startsWith('"')) {
    let s = ''
    while (input[i] !== '"') {
      if (input[i] === '\\') {
        s = s + input.substr(i, 2)
        i += 2
      } else {
        s = s + input[i]
        i++
      }
    }
    return [s, input.slice(i + 1)]
  }
  return null
}

function numParser (input) {
  let regexp = String(input).match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/)
  if (!String(input).match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/)) return null
  return [parseInt(regexp[0]), input.slice(regexp[0].length)]
}

function arrayParser (input) {
  let result
  let s = []
  if (!input.startsWith('[')) {
    return null
  }
  input = input.slice(1)
  while (true) {
    result = spaceParser(input)
    if (result !== null) input = result[1]
    result = valueParser(input)
    if (result === null) break
    s.push(result[0])
    input = result[1]
    result = spaceParser(input)
    if (result !== null) input = result[1]
    result = commaParser(input)
    if (result === null) break
    input = result[1]
    if (input.startsWith(']')) {
      return null
    }
  }
  result = spaceParser(input)
  if (result !== null) input = result[1]
  if (input.startsWith(']')) {
    return [s, input.slice(1)]
  }
  return null
}

function objectParser (input) {
  let obj = {}
  let key = ''
  let value
  let result
  if (!input.startsWith('{')) return null
  input = input.slice(1)
  while (true) {
    result = spaceParser(input)
    if (result !== null) input = result[1]
    result = stringParser(input)
    if (result === null) break
    else {
      key = result[0]
      input = result[1]
      result = spaceParser(input)
      if (result !== null) input = result[1]
      result = colonParser(input)
      if (result === null) return null
      input = result[1]
      result = spaceParser(input)
      if (result !== null) input = result[1]
      result = valueParser(input)
      if (result === null) return null
      value = result[0]
      obj[key] = value
      input = result[1]
      result = spaceParser(input)
      if (result !== null) input = result[1]
      result = commaParser(input)
      if (result === null) break
      input = result[1]
      if (input.startsWith('}')) {
        return null
      }
    }
  }
  result = spaceParser(input)
  if (result !== null) input = result[1]
  if (!input.startsWith('}')) return null
  return [obj, input.slice(1)]
}

function valueParser (input) {
  let result
  result = objectParser(input) || arrayParser(input) || stringParser(input) || numParser(input) || nullParser(input) || boolParser(input)
  return result
}
let input = require('fs').readFileSync('example.txt').toString()
let output = valueParser(input)
if (output === null) output = 'Invalid JSON'
else {
  let result = output[1].trim()
  if (result.length !== 0) output = 'Invalid JSON'
  else output = output[0]
}
console.log(output)
