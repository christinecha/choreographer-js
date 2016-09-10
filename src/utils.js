const isBetween = (val, min, max) => {
  return val >= min && val <= max
}

const getProgress = (val, [min, max]) => {
  return (val - min) / (max - min)
}

const getInjectedString = (injection, matchStart, matchEnd, string) => {
  const startOfString = string.split(matchStart)[0]
  const endOfString = string.split(matchStart)[1].split(matchEnd)[1]
  return startOfString + injection + endOfString
}

const getInjectedTransformString = (node, prop, val) => {

  // Make a nice new string out of it with the scaled value.
  const transformInjection = `${prop}(${val})`

  // Get the node's previous transform value and store it.
  let oldTransformString = node.style.transform || ''
  let newTransformString = oldTransformString

  // Check if the new prop is already declared somehow in the old style value
  const transformPropExists = oldTransformString.indexOf(prop) > -1

  // Because if it is, you don't want to add another copy.
  if (transformPropExists) newTransformString = getInjectedString(transformInjection, prop, ')', oldTransformString)
  // In the same vein, if it isn't, you can't just replace the value because there might
  // be some other transform properties hangin' out in there.
  else newTransformString += ' ' + transformInjection

  return newTransformString
}
