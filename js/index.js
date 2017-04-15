// should match with css
const TRANSITION_TIME = 800
const TRANSITION_DELAY = 800

// can be whatever
const ITERATION_INTERVAL = 100
const INITIAL_DELAY = 2000
const SHUFFLE = true

const Z_DISTANCE = 0.1

function addExtraSpaces(toText, fromText) {
  let fromTextSpaces = 0
  let toTextSpaces = 0
  for (let i = 0; i < fromText.length; i++) {
    if (fromText[i] === ' ') fromTextSpaces += 1
  }
  for (let i = 0; i < toText.length; i++) {
    if (toText[i] === ' ') toTextSpaces += 1
  }
  if (fromTextSpaces - toTextSpaces > 0) {
    for (let i = 0; i < (fromTextSpaces - toTextSpaces); i++) {
      if (i % 2 === 0) toText = ` ${toText}`
      else toText = `${toText} `
    }
  }
  if (toTextSpaces - fromTextSpaces > 0) {
    for (let i = 0; i < (toTextSpaces - fromTextSpaces); i++) {
      if (i % 2 === 0) fromText = ` ${fromText}`
      else fromText = `${fromText} `
    }
  }
  return {
    normalizedTo: toText,
    normalizedFrom: fromText,
  }
}

function validate(to, from) {
  if (from.length !== to.length) return false
  const sortedFromArr = from.split('').sort()
  const sortedToArr = to.split('').sort()
  return sortedFromArr.every((letter, index) => sortedToArr[index] === letter)
}

function shuffle(array) {
  const length = array.length
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * length)
    const temp = array[rand]
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

function sortDomElements(elem, elem2) {
  if (elem.innerHTML < elem2.innerHTML) return -1
  if (elem.innerHTML > elem2.innerHTML) return 1
  return 0
}

function getDifferenceOfOffsets(toText, fromText) {
  const sortedToText = toText.sort(sortDomElements)
  const sortedFromText = fromText.sort(sortDomElements)

  return sortedFromText.map((elem, index) => ({
    elem,
    distance: sortedToText[index].getBoundingClientRect().left - elem.getBoundingClientRect().left,
  }))
}

function animateSpan(span, distance) {
  const directionClass = Math.random() > 0.5 ? 'is-background' : 'is-foreground'
  // move forward or backward
  span.classList.add(directionClass)
  const scale = directionClass === 'is-background' ? 1.0 - Z_DISTANCE : 1.0 + Z_DISTANCE
  span.style.transform = `scale(${scale})`
  span.style.zIndex = directionClass === 'is-background' ? 1 : 3

  // begin animation
  setTimeout(() => {
    span.style.transform = `translateX(${distance}px) scale(${scale})`
  }, TRANSITION_DELAY)

  // move back to initial z distance
  setTimeout(() => {
    span.classList.remove(directionClass)
    span.style.transform = `translateX(${distance}px) scale(1.0)`
  }, TRANSITION_TIME + TRANSITION_DELAY)
}

function iterateAnimating(index, toMove) {
  if (index === toMove.length) return
  const { elem: span, distance } = toMove[index]
  if (distance !== 0) requestAnimationFrame(() => animateSpan(span, distance))
  setTimeout(() => {
    iterateAnimating(index + 1, toMove)
  }, ITERATION_INTERVAL)
}

function anagramize(to, from, selector, delay) {
  const container = document.getElementById(selector)

  const fromText = document.createElement('h1')
  fromText.innerHTML = spanIze(from)
  container.appendChild(fromText)

  const toText = document.createElement('h1')
  toText.innerHTML = spanIze(to)
  container.appendChild(toText)

  const toMove = getDifferenceOfOffsets(Array.from(toText.children), Array.from(fromText.children))
  const shuffledFromTextChildren = SHUFFLE ? shuffle(toMove) : toMove
  setTimeout(() => iterateAnimating(0, shuffledFromTextChildren), delay)
}

function getQueryParamaters() {
  const parts = window.location.search.substring(1, window.location.search.length).split('&')
  return parts.reduce((obj, part) => {
    const partsOfParts = part.split('=')
    obj[partsOfParts[0]] = partsOfParts[1]
    return obj
  }, {})
}

function begin() {
  let { to, from, delay } = getQueryParamaters()
  to = to.replace(/%20/g, ' ')
  from = from.replace(/%20/g, ' ')
  const { normalizedTo, normalizedFrom } = addExtraSpaces(to, from)
  if (validate(normalizedTo, normalizedFrom)) {
    anagramize(normalizedTo, normalizedFrom, 'text', delay || INITIAL_DELAY)
  } else {
    console.error('invalid anagram')
  }
}

begin()
