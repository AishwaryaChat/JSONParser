let input = '"abnthg\\"cd\\"" : " "'

function nullParser (input) {
  if (input.slice(0, 4) === 'null') {
    return [null, input.slice(4)]
  } else {
    return null
  }
}

function BoolParser (input) {
  if (input.slice(0, 4) === 'true') {
    return [true, input.slice(4)]
  } else if (input.slice(0, 4) === 'false') {
    return [false, input.slice(4)]
  } else {
    return null
  }
}

function commaParser (input) {
  if (input.slice(0, 1) === ',') {
    return [',', input.slice(1)]
  } else {
    return null
  }
}

function colonParser (input) {
  if (input.slice(0, 1) === ':') {
    return [':', input.slice(1)]
  } else {
    return null
  }
}

function spaceParser (input) {
  if (input.slice(0, 1) === ' ') {
    return [' ', input.slice(1)]
  } else {
    return null
  }
}

function StringParser (input) {
  let i = 1
  if (input.startsWith('"')) {
    let s = ''
    while (input[i] !== '"') {
      console.log(i)
      if (input[i] === '\\') {
        s = s + input.substr(i, 2)
        i += 2
      } else {
        s = s + input[i]
        i++
      }
    }
    return [s , input.slice(i + 1)]
  }
  return null
}

function numParser (input) {
  let regexp = /(\d+\.\d+)|(\d+)/.exec(input)
  if (regexp != null) {
    return [parseFloat(regexp[0]), input.slice(regexp[0].length)]
  }
  return null
}

function arrayParser (input) {
  let regexp = /^\[(.*)/.exec(input)
  if (regexp !== null) {
    return regexp[1]
  } else {
    return null
  }
}

function objectParser (input) {
  if (StringParser(input) !== null && colonParser) {
    return [StringParser(input) + '']
  }
}

let output = StringParser(input)

console.log(output)
