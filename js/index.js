// should match with css
const TRANSITION_TIME = 800
const TRANSITION_DELAY = 800

// can be whatever
const ITERATION_INTERVAL = 100
const INITIAL_DELAY = 1000
const SHUFFLE = true

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

const sortDomElements = (elem, elem2) => {
  if (elem.innerHTML < elem2.innerHTML) return -1
  else if (elem.innerHTML > elem2.innerHTML) return 1
  else return 0
}

function getDifferenceOfOffsets(toText, fromText) {
  let sortedToText = toText.sort(sortDomElements)
  let sortedFromText = fromText.sort(sortDomElements)

  return sortedFromText.map((elem, index) => {
    return {
      elem,
      distance: sortedToText[index].getBoundingClientRect().left - elem.getBoundingClientRect().left
    }
  })
}

function anagramize(to, from, selector) {
  const container = document.getElementById(selector)

  const fromText = document.createElement('h1')
  fromText.innerHTML = spanIze(from)
  container.appendChild(fromText)

  const toText = document.createElement('h1')
  toText.innerHTML = spanIze(to)
  container.appendChild(toText)

  const toTextChildren = Array.from(toText.children)
  const fromTextChildren = Array.from(fromText.children)

  let toMove = getDifferenceOfOffsets(toTextChildren, fromTextChildren)

  const shuffledFromTextChildren = SHUFFLE ? shuffle(toMove) : toMove

  function iterateAnimating(index){
    if (index === toMove.length){
      return
    }
    let { elem: span, distance } = toMove[index]
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
          span.style.transform = `translateX(${distance}px) scale(${scale})`
        }, TRANSITION_DELAY)

        // move back to initial z distance
        setTimeout(()=>{
          span.classList.remove(directionClass)
          span.style.transform = `translateX(${distance}px) scale(1.0)`
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