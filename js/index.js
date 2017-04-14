
// should match with css
const TRANSITION_TIME = 800

// can be whatever
const TRANSITION_DELAY = 800
const ITERATION_INTERVAL = 100
const INITIAL_DELAY = 500
const RANDOMIZE = true

const Z_DISTANCE = 0.1

function validate(from, to){
  if (from.length !== to.length) return false
  let fromArr = from.split('').sort()
  let toArr = to.split('').sort()
  return fromArr.every((letter, index) => toArr[index] === letter)
}

function shuffle(array){
  let length = array.length
  for (let i = 0; i < length; i++){
    let rand = Math.floor(Math.random() * length)
    let temp = array[rand]
    array[rand] = array[i]
    array[i] = temp
  }
  return array
}

function spanIze(word) {
  return word.split('')
  .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
  .join('')
}

function getOffsets(domArray) {
  const map = domArray.reduce((obj, $item) => {
    const letter = $item.innerText
    if (!obj[letter]) obj[letter] = {
      $elems: [],
      offsets: []
    }
    obj[letter].$elems.push($item)
    obj[letter].offsets.push($item.offsetLeft)
    return obj
  }, {})
  return map
}

function getDifferenceOfOffsets(toObject, fromObject) {
  return Object.keys(toObject).reduce((newObject, key) => {
    // set up new data structure
    if (!newObject[key]) {
      newObject[key] = {
        $elems: [],
        offsets: []
      }
    }
    toObject[key].$elems.forEach((elem, index) => {
      newObject[key].$elems[index] = fromObject[key].$elems[index]
    })
    toObject[key].offsets.forEach((offset, index) => {
      newObject[key].offsets[index] = fromObject[key].offsets[index] - offset
    })
    return newObject
  }, {})
}

function anagramize(from, to, selector) {
  const container = document.getElementById(selector)
  const fromText = document.createElement('h1')
  fromText.innerHTML = spanIze(from)
  container.appendChild(fromText)
  const toText = document.createElement('h1')
  toText.innerHTML = spanIze(to)
  container.appendChild(toText)

  const toTextChildren = Array.from(toText.children)
  const fromTextChildren = Array.from(fromText.children)

  const toDistances = getOffsets(toTextChildren)
  const fromDistances = getOffsets(fromTextChildren)

  let toMove = getDifferenceOfOffsets(toDistances, fromDistances)

  const shuffledFromTextChildren = RANDOMIZE ? shuffle(fromTextChildren) : fromTextChildren

  function iterateAnimating(index){
    if (index === shuffledFromTextChildren.length) return
    let letter = shuffledFromTextChildren[index].innerText
    const distance = toMove[letter].offsets.shift()
    const span  = toMove[letter].$elems.shift()
    if (distance !== 0){ 
      requestAnimationFrame(() => {
        const directionClass = Math.random() > 0.5 ? 'is-background' : 'is-foreground'
        // move forward or backward
        span.classList.add(directionClass)
        const scale = directionClass === 'is-background' ? 1.0 - Z_DISTANCE : 1.0 + Z_DISTANCE
        span.style.transform = `scale(${scale})`
        span.style.zIndex = directionClass === 'is-background' ? 1 : 3
        
        // begin animation
        setTimeout(()=>{
          span.style.transform = `translateX(${-distance}px) scale(${scale})`
        }, TRANSITION_DELAY)

        // move back to initial z distance
        setTimeout(()=>{
          span.classList.remove(directionClass)
          span.style.transform = `translateX(${-distance}px) scale(1.0)`
        }, TRANSITION_TIME + TRANSITION_DELAY)
      })
    }
    setTimeout(()=>{
      iterateAnimating(index+1)
    }, ITERATION_INTERVAL)
  }

  setTimeout(()=>iterateAnimating(0), INITIAL_DELAY)
 }

function getQueryParamaters(){
  let parts = window.location.search.substring(1, window.location.search.length).split('&')
  return parts.reduce((obj, part)=>{
    let partsOfParts = part.split('=')
    obj[partsOfParts[0]] = partsOfParts[1]
    return obj
  }, {})
}

let {to, from} = getQueryParamaters()
to = to.replace('%20', ' ')
from = from.replace('%20', ' ')
if (validate(to, from)){
  anagramize(to, from, 'text')
} else {
  console.error('invalid anagram')
}