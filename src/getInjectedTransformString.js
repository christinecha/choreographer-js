const translations = {
  translateX: 0,
  translateY: 1,
  translateZ: 2
}

const scales = {
  scaleX: 0,
  scaleY: 1,
  scaleZ: 2
}

const getInjectedTransformString = (node, prop, val, _transform = 'transform') => {

  // Get the node's previous transform value and store it.
  let oldTransformString = node.style[_transform] || ''

  let transform3dString
  let axis
  let xyz

  if (translations[prop]) {
    axis = translations[prop]
    prop = 'translate3d'
    xyz = ['0','0','0']

    if (!val) val = 0

  } else if (scales[prop]) {
    axis = scales[prop]
    prop = 'scale3d'
    xyz = ['1','1','1']

    if (!val) val = 1
  }

  if (axis) {
    if (oldTransformString.indexOf(prop) > -1) {
      const startOfString = oldTransformString.split(`${prop}(`)[0]
      const extractedValue = oldTransformString.split(`${prop}(`)[1].split(')')[0]
      xyz = extractedValue.split(',')
    }

    xyz[axis] = val
    transform3dString = `${prop}(${xyz.join(',')})`
  }

  // Make a nice new string out of it with the scaled value.
  const transformInjection = transform3dString || `${prop}(${val})`

  let newTransformString = oldTransformString

  // Check if the new prop is already declared somehow in the old style value
  const transformPropExists = oldTransformString.indexOf(prop) > -1

  // Because if it is, you don't want to add another copy.
  if (transformPropExists) {
    const startOfString = oldTransformString.split(prop)[0]
    const endOfString = oldTransformString.split(prop)[1].split(')')[1]
    newTransformString = startOfString + transformInjection + endOfString
  }
  // In the same vein, if it isn't, you can't just replace the value because there might
  // be some other transform properties hangin' out in there.
  else newTransformString += ' ' + transformInjection

  return newTransformString
}

module.exports = getInjectedTransformString
