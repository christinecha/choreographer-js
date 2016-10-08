'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Animation = function () {
  function Animation(config) {
    _classCallCheck(this, Animation);

    this.config = config;
    this.storeNodes();
  }

  // Either use 'selector' or 'selectors' to find and store all the DOM nodes.


  _createClass(Animation, [{
    key: 'storeNodes',
    value: function storeNodes() {
      var _this = this;

      if (this.config.selector) {

        if (typeof this.config.selector === 'string') {
          this.nodes = Array.prototype.slice.call(document.querySelectorAll(this.config.selector));
        } else if (this.config.selector.length) {
          this.nodes = Array.prototype.slice.call(this.config.selector);
        } else {
          this.nodes = [this.config.selector];
        }
      }

      if (this.config.selectors) {
        this.nodes = [];
        this.config.selectors.forEach(function (s) {

          if (typeof s === 'string') {
            var nodes = Array.prototype.slice.call(document.querySelectorAll(s));
            _this.nodes = _this.nodes.concat(nodes);
          } else if (_this.config.selector.length) {
            _this.nodes = _this.nodes.concat(Array.prototype.slice.call(s));
          } else {
            _this.nodes = _this.nodes.push(s);
          }
        });
      }
    }

    // Just a helper to get the relative location of a value within a range.
    // example: getProgress(1, [0, 2]) = 0.5

  }, {
    key: 'getProgress',
    value: function getProgress(val, _ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var min = _ref2[0];
      var max = _ref2[1];

      return (val - min) / (max - min);
    }

    /** Returns the 'progress' - relative position within the animation range.
      * @param {Number} position  | passed in value from 'runAt' (below)
      * @return {Number} progress | the relative location (between 0 and 1 when in range) within a range.
                                    if there are multiple ranges and the position is not in any of them,
                                    return -1. Otherwise, return the value (even if out of range).
     **/

  }, {
    key: 'getProgressAt',
    value: function getProgressAt(position) {
      // If there are multiple ranges, then figure out which one is relevant and
      // calculate the progress within that one. You can't have multiple active
      // ranges unless they're overlapping -- in which case it is YOUR bug, dude.
      if (_typeof(this.config.range[0]) === 'object') {

        var activeRange = void 0;

        // If there's a range that is active, store it!
        this.config.range.forEach(function (r) {
          if (isBetween(postion, r[0], r[1])) activeRange = r;
        });

        if (!activeRange) return -1;else return this.getProgress(position, activeRange);
      }

      return this.getProgress(position, this.config.range);
    }

    /** And this is where all of that work ~finally~ pays off!
      * This runs the animation by getting the relative progress and running accordingly.
      * @param {Number} position  | the location marker - could be a scroll location, a timestamp, a mouseX position...
     **/

  }, {
    key: 'runAt',
    value: function runAt(position) {
      var _this2 = this;

      var progress = this.getProgressAt(position);

      // If we are OUT OF RANGE, then we have to do a few extra things.
      if (progress < 0 || progress > 1) {

        // First, check if any of our nodes were already animated at this same style prop, at this same location.
        var animated = void 0;
        this.nodes.forEach(function (node) {
          if (node.getAttribute('animated').indexOf(_this2.config.style) > -1) animated = true;
        });

        // If NOT, then you can go ahead and animate it here.
        // We need this checkpoint to avoid overriding each other.

        // If you're using class instead of style props, it don't matter.
        if (this.config.style === 'class' || !animated) {
          // If it's a simple 'change' function, we just need a value outside of 0 to 1. Could be -9.87. Doesn't matter.
          if (this.config.type === 'change') progress = -1;

          // If it's a 'scale' function, then get the min or max progress.
          if (this.config.type === 'scale') {
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
          }
        } else {

          // If we are OUT OF RANGE and some of our nodes are already animated, then get out of here!!!!
          return;
        }
      }

      // OK, finally ready? Run that animation, baby.
      this.nodes.forEach(function (node) {

        // If in range ---
        // (Notice that we're NOT doing >= and <= here. This is because if you're on the edges of the
        // range, you should be able to override this animation with another one.)
        if (progress > 0 && progress < 1) {
          node.setAttribute('animated', node.getAttribute('animated') + '|' + _this2.config.style);
        }

        _this2.config.fn({
          node: node,
          style: _this2.config.style,
          from: _this2.config.from,
          to: _this2.config.to,
          unit: _this2.config.unit,
          progress: progress
        });
      });
    }
  }]);

  return Animation;
}();

module.exports = Animation;