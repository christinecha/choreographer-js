const Animation = require('./Animation')
const defaultAnimations = require('./defaultAnimations')

// Store a no-op
const noop = () => {}


/** Choreographer
  * constructed with a config object with the following keys and values:
      {Object} customFunctions | [optional] Keys are function names, values are animation functions.
      {Array} animations       | An array of Animation class config objects.
 **/
class Choreographer {
  constructor(config) {
    this.customFunctions = config.customFunctions || {}
    this.animations = config.animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })
  }

  /** Helper to grab a function by its type. First try the defaults, then custom, then no-op.
    * @param {String} type | the name (or key value) of the animation function.
   **/
  getAnimationFn(type) {
    return defaultAnimations[type] || this.customFunctions[type] || noop
  }

  /** If you need to update the animation configs at any point.
    * @param {Array} animations | An array of your new Animation class config objects.
   **/
  updateAnimations(animations) {
    // Wipe out the old animations and replace 'em.
    this.animations = animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })
  }

  /** Run those animations based on a given location!
    * @param {Number} position | the location marker - could be a scroll location, a timestamp, a mouseX position...
   **/
  runAnimationsAt(position) {

    // Clear all the nodes' 'animated' attribute.
    this.animations.forEach(anim => {
      anim.nodes.forEach(node => node.setAttribute('animated', ''))
    })

    // Run and done.
    this.animations.forEach(anim => anim.runAt(position))
  }
}

module.exports = Choreographer
