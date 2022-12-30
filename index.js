// Set up the diffs object
let diffs

function compare(item1, item2, diffRef = diffs, key) {

  // Make sure we have a key
  if (!key && key !== 0) {
    return
  }

  // Get the types of things we're comparing
  const type1 = Object.prototype.toString.call(item1)
  const type2 = Object.prototype.toString.call(item2)
  const diffType = Object.prototype.toString.call(diffRef)

  // The item does not exist in the second object
  // Remove it from an array
  // Set it to null in an object
  if (type2 === '[object Undefined]') {
    if (diffType === '[object Array]') {
      return
    }
    diffRef[key] = null
    return
  }

  // The types are different just replace the whole item
  if (type1 !== type2) {
    diffRef[key] = item2
    return
  }

  // The type is a function and they are different just replace the whole item
  if (type1 === '[object Function]') {
    if (item1.toString() !== item2.toString()) {
      diffRef[key] = item2
      return
    }
  }

  // Convert the items to strings
  const string1 = JSON.stringify(item1)
  const string2 = JSON.stringify(item2)

  // The strings are the same
  // If were working with an array add the item to the array
  // Everything else do nothing
  if (string1 === string2) {
    if (diffType === '[object Array]') {
      diffRef[key] = item2
    }
    return
  }

  // The item is an object
  // We need to dig deeper
  if (type1 === '[object Object]') {
    diffRef[key] = diffRef[key] || {}
    deepdiff(item1, item2, diffRef[key])
    return
  }

  // The item is an array
  // We need to dig deeper
  if (type1 === '[object Array]') {
    item1.forEach((deepItem1, index) => {
      const deepItem2 = item2[index]
      diffRef[key] = diffRef[key] || []
      compare(deepItem1, deepItem2, diffRef[key], index)
    })
    return
  }

  // The item is a string, number, boolean, etc
  // Just compare them
  if (item1 != item2) {
    diffRef[key] = item2
    return
  }
}

function deepdiff(thing1, thing2, diffRef) {
  diffs = !diffRef ? {} : diffs
  // Loop through the first object
  for (const key in thing1) {
    if (thing1[key]) {
      compare(thing1[key], thing2[key], diffRef, key);
    }
  }

  // Loop through the second object and find missing items
  for (const key in thing2) {
    if (thing2[key]) {
      compare(thing1[key], thing2[key], diffRef, key);
    }
  }

  return diffs
}

export default deepdiff
