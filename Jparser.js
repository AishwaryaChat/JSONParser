var input = '{"glossary": {   "title"   : "example glossary","GlossDiv": {"title": "S","GlossList": {"GlossEntry": {"ID": "SGML","SortAs": "SGML","GlossTerm": "Standard Generalized Markup Language","Acronym": "SGML","Abbrev": "ISO 8879:1986","GlossDef": {"para": "A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso": ["GML", "XML"]},"GlossSee": "markup"}}}}}'

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
  if (!input.match(/^[\s\n]/)) return null
  let regexp = input.slice(input.match(/\S/).index)
  return [null, regexp]
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
  let space = spaceParser(input)
  if (space !== null) {
    input = space[1]
  }
  while (true) {
    let result = valueParser(input)
    if (result === null) return null
    s.push(result[0])
    input = result[1]
    space = spaceParser(input)
    if (space !== null) {
      input = space[1]
    }
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
  let space = spaceParser(input)
  if (space !== null) {
    input = space[1]
    console.log(input)
  }
  while (true) {
    let result = stringParser(input)
    if (result === null) break
    else {
      key = result[0]
      input = result[1]
      space = spaceParser(input)
      if (space !== null) {
        input = space[1]
      }
      result = colonParser(input)
      if (result === null) return null
      input = result[1]
      space = spaceParser(input)
      if (space !== null) {
        input = space[1]
      }
      result = valueParser(input)
      if (result === null) return null
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
    // console.log(obj)
    return [obj, input.slice(1)]
  }
  return null
}

function valueParser (input) {
  let result = input
  while (result !== null) {
    if (arrayParser(input) !== null) {
      result = arrayParser(input)
      input = result[1]
    } else if (objectParser(input) !== null) {
      result = objectParser(input)
      input = result[1]
    } else if (numParser(input) !== null) {
      result = numParser(input)
      input = result[1]
    } else if (stringParser(input) !== null) {
      result = stringParser(input)
      input = result[1]
    } else if (boolParser(input) !== null) {
      result = boolParser(input)
    } else if (nullParser(input) !== null) {
      result = nullParser(input)
      input = result[1]
    } else return result
  }
}

let output = valueParser(input)
console.log(output)
