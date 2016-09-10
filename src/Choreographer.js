const Animation = require('./Animation')
const getInjectedTransformString = require('./getInjectedTransformString')
const noop = () => {}


class Choreographer {
  constructor(animations) {
    this.animations = animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })

    this.boundHandleScroll = this.handleScroll.bind(this)
    this.boundRequestScroll = this.requestScroll.bind(this)
  }

  handleScroll() {
    const scrollPosition = window.pageYOffset
    this.runAnimationsAt(scrollPosition)
  }

  requestScroll() {
    requestAnimationFrame(this.boundHandleScroll)
  }

  on() {
    this.requestScroll()
    window.addEventListener('scroll', this.boundRequestScroll)
  }

  off() {
    window.removeEventListener('scroll', this.boundRequestScroll)
  }

  getAnimationFn(type) {
    if (type === 'scale') return this.scale
    if (type === 'change') return this.change
    return noop
  }

  updateAnimations(animations) {
    this.animations = animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })
    this.requestScroll()
  }

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
  scale(data) {
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
    * Based on the data provided, your node will have the style value assigned or removed.
    *
    * @param {Object} data : {
    *          {Node} node       | the node you want to modify
    *          {String} style    | the style property you want to modify
    *          {Number} to       | the style value
    *          {Number} progress | a value between 0 and 1; the proportion of value we should use
    *        }
   **/
  change(data) {
    const newValue = data.progress < 0 ? null : data.to

    // If the progress is less than 0, we just need to nullify this style value.
    if (data.progress < 0 && data.style === 'transition') {
      data.node.addEventListener('transitionend', (e) => {
        if (e.target === data.node) data.node.style[data.style] = null
      })
      return
    }

    // If it's a regular old style property, just replace the value. No fuss.
    if (data.style.split(':').length === 1) {
      data.node.style[data.style] = newValue
      return
    }

    /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
    const transformProp = data.style.split(':')[1]
    data.node.style.transform = getInjectedTransformString(data.node, transformProp, newValue)
  }

  getCustomFunction(type) {
    return this.customFunctions[type] || noop
  }

  runAnimationsAt(scrollPosition) {
    this.animations.forEach(anim => {
      const progress = anim.getProgressAt(scrollPosition)
      if (progress >= 0 && progress <= 1) {
        anim.runAt(progress)
      } else if (anim.config.type === 'change') {
        anim.runAt(-1)
      }
    })
  }
}

module.exports = Choreographer
