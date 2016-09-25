'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation = require('./Animation');
var defaultAnimations = require('./defaultAnimations');

// Store a no-op
var noop = function noop() {};

/** Choreographer
  * constructed with a config object with the following keys and values:
      {Object} customFunctions | [optional] Keys are function names, values are animation functions.
      {Array} animations       | An array of Animation class config objects.
 **/

var Choreographer = function () {
  function Choreographer(config) {
    var _this = this;

    _classCallCheck(this, Choreographer);

    this.customFunctions = config.customFunctions || {};
    this.animations = config.animations.map(function (anim) {
      anim.fn = _this.getAnimationFn(anim.type);
      return new Animation(anim);
    });
  }

  /** Helper to grab a function by its type. First try the defaults, then custom, then no-op.
    * @param {String} type | the name (or key value) of the animation function.
   **/


  _createClass(Choreographer, [{
    key: 'getAnimationFn',
    value: function getAnimationFn(type) {
      return defaultAnimations[type] || this.customFunctions[type] || noop;
    }

    /** If you need to update the animation configs at any point.
      * @param {Array} animations | An array of your new Animation class config objects.
     **/

  }, {
    key: 'updateAnimations',
    value: function updateAnimations(animations) {
      var _this2 = this;

      // Wipe out the old animations and replace 'em.
      this.animations = animations.map(function (anim) {
        anim.fn = _this2.getAnimationFn(anim.type);
        return new Animation(anim);
      });
    }

    /** Run those animations based on a given location!
      * @param {Number} position | the location marker - could be a scroll location, a timestamp, a mouseX position...
     **/

  }, {
    key: 'runAnimationsAt',
    value: function runAnimationsAt(position) {

      // Clear all the nodes' 'animated' attribute.
      this.animations.forEach(function (anim) {
        anim.nodes.forEach(function (node) {
          return node.setAttribute('animated', '');
        });
      });

      // Run and done.
      this.animations.forEach(function (anim) {
        return anim.runAt(position);
      });
    }
  }]);

  return Choreographer;
}();

module.exports = Choreographer;