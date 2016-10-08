const getInjectedTransformString = require('./getInjectedTransformString')

/** @method scale
  * [built-in animation function]
  * Based on the data provided, your node will receive an updated, scaled style value.
  *
  * @param {Object} data : {
  *          {Node} node       | the node you want to modify
  *          {String} style    | the style property you want to modify
  *          {Number} from     | minimum value
  *          {Number} to       | maximum value
  *          {Number} progress | a value between 0 and 1; the proportion of value we should use
  *          {String} unit     | optional - unit value, e.g. 'px' or '%'
  *        }
 **/
const scale = (data) => {
  // Get the relative value (proportional to the min-max range you gave.)
  const scaledValue = ((data.to - data.from) * data.progress) + data.from
  // Stick on the unit, if there is one.
  const scaledValueString = data.unit ? scaledValue + data.unit : scaledValue

  // If it's a regular old style property, just replace the value. No fuss.
  if (data.style.split(':').length === 1) {
    data.node.style[data.style] = scaledValueString
    return
  }

  /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
  const transformProp = data.style.split(':')[1]
  data.node.style.transform = getInjectedTransformString(data.node, transformProp, scaledValueString)
}

/** @method change
  * [built-in animation function]
  * Based on the data provided, your node will have the style value assigned or remok
  * @param {Object} data : {
  *          {Node} node       | the node you want to modify
  *          {String} style    | the style property you want to modify
  *          {Value} to        | the style value (number, string -- whatever valid type this CSS prop takes)
  *          {Number} progress | a value between 0 and 1; the proportion of value we should use
  *        }
 **/
const change = (data) => {
  const newValue = data.progress < 0 ? null : data.to
  const newValueString = newValue && data.unit ? newValue + data.unit : newValue

  // If the progress is less than 0, we just need to nullify this style value.
  // But, if the style prop is 'transition', apply it only after the last transition ends.
  if (data.progress < 0 && data.style === 'transition') {
    data.node.addEventListener('transitionend', (e) => {
      if (e.target === data.node) data.node.style[data.style] = null
    })
    return
  }

  // If it's a regular old style property, just replace the value. No fuss.
  if (data.style.split(':').length === 1) {
    if (data.style === 'class') {
      data.node.classList[newValue ? 'add' : 'remove'](data.to)
      return
    }

    data.node.style[data.style] = newValueString
    return
  }

  /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
  const transformProp = data.style.split(':')[1]
  data.node.style.transform = getInjectedTransformString(data.node, transformProp, newValueString)
}

module.exports = { scale, change }
