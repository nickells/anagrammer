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

  const shuffledFromTextChildren = shuffle(fromTextChildren)

  function iterateAnimating(index){
    if (index === shuffledFromTextChildren.length) return
    let letter = shuffledFromTextChildren[index].innerText
    const distance = toMove[letter].offsets.shift()
    const span  = toMove[letter].$elems.shift()
    requestAnimationFrame(() => {
      // begin animation
      const directionClass = Math.random() > 0.5 ? 'is-background' : 'is-foreground'
      span.classList.add(directionClass)
      setTimeout(()=>{
        span.style.transform = `translateX(${-distance}px)`
      }, 800)
      setTimeout(()=>{
        span.classList.remove(directionClass)
      }, 1600)
    })
    setTimeout(()=>{
      iterateAnimating(index+1)
    }, 100)
  }

  iterateAnimating(0)
 }

anagramize('cloth wrinkles', 'nick ellsworth', 'text')