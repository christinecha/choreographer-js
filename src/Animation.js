/** The Animation class.
  *
  * constructed with the following config object properties:
    {String} type     | the name of the animation function
    {Function} fn     | the animation function
    {Array} range     | either a one- or two-dimensional array of ranges, i.e. [0,5] or [[0,3], [4,5]]
    NOTE: Bugs will occur if you overlap animation ranges that affect the same style properties!

    [ Only one of the below (selector or selectors) is necessary. If they both exist, 'selectors' will be used. ]
    {String} selector | a valid DOM Element selector string, ex. '.classname' or '#box .thing[data-attr=true]'
    {Array} selectors | an array of selector strings (described above).

    {String} style    | a valid CSS style property.
    NOTE: If you are using 'transform', follow it with a colon and the property name, ex. 'transform:scaleX'

    {Number} from     | The minimum value to set to the style property. Useful when progressively calculating a value.
    {Number} to       | The value to set to the style property. (Or the max, when progressively calculating a value.)
    NOTE: If you are ONLY using the 'to' value, like with a 'change' animation, this could also be {String} to.

    {String} unit     | The unit string to append to the value, ex. '%', 'px', 'deg'
 **/

class Animation {
  constructor(config) {
    this.config = config
    this.storeNodes()
  }

  // Either use 'selector' or 'selectors' to find and store all the DOM nodes.
  storeNodes() {
    if (this.config.selector) {

      if (typeof this.config.selector === 'string') {
        this.nodes = Array.prototype.slice.call(document.querySelectorAll(this.config.selector))
      } else if (this.config.selector.length) {
        this.nodes = Array.prototype.slice.call(this.config.selector)
      } else {
        this.nodes = [this.config.selector]
      }
    }

    if (this.config.selectors) {
      this.nodes = []
      this.config.selectors.forEach(s => {

        if (typeof s === 'string') {
          const nodes = Array.prototype.slice.call(document.querySelectorAll(s))
          this.nodes = this.nodes.concat(nodes)
        } else if (this.config.selector.length) {
          this.nodes = this.nodes.concat(Array.prototype.slice.call(s))
        } else {
          this.nodes = this.nodes.push(s)
        }
      })
    }
  }

  // Just a helper to get the relative location of a value within a range.
  // example: getProgress(1, [0, 2]) = 0.5
  getProgress(val, [min, max]) {
    return (val - min) / (max - min)
  }

  /** Returns the 'progress' - relative position within the animation range.
    * @param {Number} position  | passed in value from 'runAt' (below)
    * @return {Number} progress | the relative location (between 0 and 1 when in range) within a range.
                                  if there are multiple ranges and the position is not in any of them,
                                  return -1. Otherwise, return the value (even if out of range).
   **/
  getProgressAt(position) {
    // If there are multiple ranges, then figure out which one is relevant and
    // calculate the progress within that one. You can't have multiple active
    // ranges unless they're overlapping -- in which case it is YOUR bug, dude.
    if (typeof this.config.range[0] === 'object') {

      let activeRange

      // If there's a range that is active, store it!
      this.config.range.forEach(r => {
        if (isBetween(postion, r[0], r[1])) activeRange = r
      })

      if (!activeRange) return -1
      else return this.getProgress(position, activeRange)
    }

    return this.getProgress(position, this.config.range)
  }

  /** And this is where all of that work ~finally~ pays off!
    * This runs the animation by getting the relative progress and running accordingly.
    * @param {Number} position  | the location marker - could be a scroll location, a timestamp, a mouseX position...
   **/
  runAt(position) {
    let progress = this.getProgressAt(position)

    // If we are OUT OF RANGE, then we have to do a few extra things.
    if (progress < 0 || progress > 1) {

      // First, check if any of our nodes were already animated at this same style prop, at this same location.
      let animated
      this.nodes.forEach(node => {
        if (node.getAttribute('animated').indexOf(this.config.style) > -1) animated = true
      })

      // If NOT, then you can go ahead and animate it here.
      // We need this checkpoint to avoid overriding each other.

      // If you're using class instead of style props, it don't matter.
      if (this.config.style === 'class' || !animated) {
        // If it's a simple 'change' function, we just need a value outside of 0 to 1. Could be -9.87. Doesn't matter.
        if (this.config.type === 'change') progress = -1

        // If it's a 'scale' function, then get the min or max progress.
        if (this.config.type === 'scale') {
          if (progress < 0) progress = 0
          if (progress > 1) progress = 1
        }
      } else {

        // If we are OUT OF RANGE and some of our nodes are already animated, then get out of here!!!!
        return
      }
    }

    // OK, finally ready? Run that animation, baby.
    this.nodes.forEach(node => {

      // If in range ---
      // (Notice that we're NOT doing >= and <= here. This is because if you're on the edges of the
      // range, you should be able to override this animation with another one.)
      if (progress > 0 && progress < 1) {
        node.setAttribute('animated', node.getAttribute('animated') + '|' + this.config.style)
      }

      this.config.fn({
        node: node,
        style: this.config.style,
        from: this.config.from,
        to: this.config.to,
        unit: this.config.unit,
        progress: progress
      })
    })
  }
}

module.exports = Animation
