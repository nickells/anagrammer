function spanIze(word) {
  return word.split('')
  .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
  .join('')
}

function getOffsets(domArray) {
  const map = domArray.reduce((obj, item) => {
    const letter = item.innerText
    if (!obj[letter]) obj[letter] = []
    obj[letter].push(item.offsetLeft)
    return obj
  }, {})
  return map
}

function differenceOfObjects(obj1, obj2) {
  return Object.keys(obj1).reduce((newObject, key) => {
    if (!newObject[key]) newObject[key] = []
    obj1[key].forEach((val, index) => {
      newObject[key][index] = obj2[key][index] - val
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

  let toMove = differenceOfObjects(toDistances, fromDistances)

  function iterateAnimating(index){
    if (index === fromTextChildren.length) return
    let span = fromTextChildren[index]
    let letter = span.innerText
    const distance = toMove[letter].shift()
    requestAnimationFrame(() => {
      span.style.transform = `translateX(${-distance}px)`
    })
    setTimeout(()=>{
      iterateAnimating(index+1)
    }, 100)
  }

  iterateAnimating(0)
  // fromTextChildren.forEach(span => {
  //   let letter = span.innerText
  //   const distance = toMove[letter].shift()
  //   requestAnimationFrame(() => {
  //     span.style.transform = `translateX(${-distance}px)`
  //   })
  // })
}

anagramize('cloth wrinkles', 'nick ellsworth', 'text')