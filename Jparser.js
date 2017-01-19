var input = '{}'

function nullParser (input) {
  if (input.slice(0, 4) === 'null') {
    return [null, input.slice(4)]
  } return null
}

function BoolParser (input) {
  if (input.slice(0, 4) === 'true') {
    return [true, input.slice(4)]
  } else if (input.slice(0, 4) === 'false') {
    return [false, input.slice(4)]
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
    let result = spaceParser(input)
     if (result === null) break
     s.push(result[0])
     input = result[1]
     result = commaParser(input)
     if (result === null) break
     input = result[1]
     if(input.startsWith(']')){
       return null
     }
}

  if(input.startsWith(']')){
    return [s, input.slice(1)]
  }
  return null
}

 function objectParser (input) {
   let obj  = {}
   if(!input.startsWith('{')){
    return null
  }
  input = input.slice(1)
  while (true) {
    result = stringParser(input)
    if(result === null) break
  }
  if (input.startsWith('}'))
  return [obj , input.slice(1)]
//   if(spaceParser(input)){
//     intput = spaceParser(input)[1]
//   }
//   console.log()
}

function elementParser (input) {
  result = nullParser(input)
  boolParser(input)
  commaParser(input)
  colonParser(input)
  spaceParser(input)
  stringParser(input)
  numParser(input)
}

// function ParserFactory (input) {}
let output = objectParser(input)
// objectParser(input)
console.log(output)
