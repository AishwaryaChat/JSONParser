var input = '{"name":{"main":"aish","age":24,"Siblings":["Deep","Iti"]}'

function nullParser (input) {
  if (input.slice(0, 4) === 'null') {
    return [null, input.slice(4)]
  } return null
}

function boolParser (input) {
  if (input.slice(0, 4) === 'true') {
    return [true, input.slice(4)]
  } else if (input.slice(0, 5) === 'false') {
    return [false, input.slice(5)]
  }
  return null
}

function commaParser (input) {
  if (input.slice(0, 1) === ',') {
    return [',', input.slice(1)]
  }
  return null
}

function colonParser (input) {
  if (input.slice(0, 1) === ':') {
    return [':', input.slice(1)]
  }
  return null
}

function spaceParser (input) {
  let regexp = input.match(/^[\s\n]/)
  if (!input.match(/^[\s\n]/)) return null
  return ['', input.slice(regexp[0].length)]
}

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
  let s = []
  if (!input.startsWith('[')) {
    return null
  }
  input = input.slice(1)
  while (true) {
    let result = arrayParser(input)
    if (result === null) {
      if (numParser(input) !== null) {
        result = numParser(input)
      } else if (stringParser(input) !== null) {
        result = stringParser(input)
      } else if (boolParser(input) !== null) {
        result = boolParser(input)
      } else break
    }
    s.push(result[0])
    input = result[1]
    result = commaParser(input)
    if (result === null) break
    input = result[1]
    if (input.startsWith(']')) {
      return null
    }
  }
  if (input.startsWith(']')) {
    return [s, input.slice(1)]
  }
  return null
}

function objectParser (input) {
  let obj = {}
  let key = ''
  let value = ''
  if (!input.startsWith('{')) {
    return null
  }
  input = input.slice(1)
  while (true) {
    let result = stringParser(input)
    if (result === null) break
    else {
      key = result[0]
      input = result[1]
      result = colonParser(input)
      if (result === null) return null
      input = result[1]
      result = objectParser(input)
      if (result === null) {
        if (numParser(input) !== null) {
          result = numParser(input)
        } else if (stringParser(input) !== null) {
          result = stringParser(input)
        } else if (boolParser(input) !== null) {
          result = boolParser(input)
        } else if (arrayParser(input) !== null) {
          result = arrayParser(input)
        } else break
      }
      value = result[0]
      input = result[1]
      obj[key] = value
      input = result[1]
      result = commaParser(input)
      if (result === null) break
      input = result[1]
      if (input.startsWith('}')) {
        return null
      }
    }
  }
  if (input.startsWith('}')) {
    return [obj, input.slice(1)]
  }
  return null
}

let output = objectParser(input)
console.log(output)
