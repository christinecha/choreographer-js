const Animation = require('./Animation')

const defaultAnimations = require('./defaultAnimations')

const noop = () => {}


class Choreographer {
  constructor(config) {
    this.customFunctions = config.customFunctions || {}
    this.animations = config.animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })
  }

  getAnimationFn(type) {
    return defaultAnimations[type] || this.customFunctions[type] || noop
  }

  updateAnimations(animations) {
    this.animations = animations.map(anim => {
      anim.fn = this.getAnimationFn(anim.type)
      return new Animation(anim)
    })
  }

  runAnimationsAt(position) {
    this.animations.forEach(anim => {
      anim.nodes.forEach(node => node.setAttribute('animated', ''))
    })

    this.animations.forEach(anim => {
      const progress = anim.getProgressAt(position)

      if (progress >= 0 && progress <= 1) {
        anim.runAt(progress)
      } else {
        let animated

        anim.nodes.forEach(node => {
          if (node.getAttribute('animated').indexOf(anim.config.style) > -1) animated = true
        })

        if (!animated) {
          if (anim.config.type === 'change') anim.runAt(-1)
          if (anim.config.type === 'scale') {
            if (progress < 0) anim.runAt(0)
            if (progress > 1) anim.runAt(1)
          }
        }
      }
    })
  }
}

module.exports = Choreographer
