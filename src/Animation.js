class Animation {
  constructor(config) {
    this.config = config
    this.nodes = Array.from(document.querySelectorAll(this.config.selector))
  }

  getProgress(val, [min, max]) {
    return (val - min) / (max - min)
  }

  /** Returns the 'progress' - relative position within the animation range.
    * If there are multiple ranges and the animation is within none of them,
    * return -1.
   **/
  getProgressAt(position) {
    if (typeof this.config.range[0] === 'object') {

      let activeRange

      this.config.range.forEach(r => {
        if (isBetween(postion, r[0], r[1])) activeRange = r
      })

      if (!activeRange) return -1
      else return this.getProgress(position, activeRange)
    }

    return this.getProgress(position, this.config.range)
  }

  runAt(progress) {
    this.nodes.forEach(node => {
      const animate = this.config.fn
      animate({
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
