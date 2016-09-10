/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Choreographer = __webpack_require__(1)
	console.log(Choreographer)

	const vh = window.innerHeight
	const dh = document.body.clientHeight

	const calculateAnimations = () => {
	  return [
	    { range: [0, dh],       selector: '#box', type: 'change', style: 'transform:translateZ', to: 0 },
	    { range: [0, vh / 3],   selector: '#box', type: 'scale',  style: 'transform:translateY', from: 0, to: -vh / 3, unit: 'px' },
	    { range: [vh / 3, dh],  selector: '#box', type: 'change', style: 'transition',           to: 'all 0.4s ease-out' },
	    { range: [vh / 3, dh],  selector: '#box', type: 'change', style: 'transform:translateY', to: `${-vh}px` }
	  ]
	}

	let choreographer = new Choreographer(calculateAnimations())

	choreographer.on()

	window.addEventListener('resize', () => {
	  choreographer.updateAnimations(calculateAnimations())
	})

	document.body.addEventListener('click', () => {
	  choreographer.off()
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Choreographer = __webpack_require__(2);
	module.exports = Choreographer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Animation = __webpack_require__(3);
	var getInjectedTransformString = __webpack_require__(4);
	var noop = function noop() {};

	var Choreographer = function () {
	  function Choreographer(animations) {
	    var _this = this;

	    _classCallCheck(this, Choreographer);

	    this.animations = animations.map(function (anim) {
	      anim.fn = _this.getAnimationFn(anim.type);
	      return new Animation(anim);
	    });

	    this.boundHandleScroll = this.handleScroll.bind(this);
	    this.boundRequestScroll = this.requestScroll.bind(this);
	  }

	  _createClass(Choreographer, [{
	    key: 'handleScroll',
	    value: function handleScroll() {
	      var scrollPosition = window.pageYOffset;
	      this.runAnimationsAt(scrollPosition);
	    }
	  }, {
	    key: 'requestScroll',
	    value: function requestScroll() {
	      requestAnimationFrame(this.boundHandleScroll);
	    }
	  }, {
	    key: 'on',
	    value: function on() {
	      this.requestScroll();
	      window.addEventListener('scroll', this.boundRequestScroll);
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      window.removeEventListener('scroll', this.boundRequestScroll);
	    }
	  }, {
	    key: 'getAnimationFn',
	    value: function getAnimationFn(type) {
	      if (type === 'scale') return this.scale;
	      if (type === 'change') return this.change;
	      return noop;
	    }
	  }, {
	    key: 'updateAnimations',
	    value: function updateAnimations(animations) {
	      var _this2 = this;

	      this.animations = animations.map(function (anim) {
	        anim.fn = _this2.getAnimationFn(anim.type);
	        return new Animation(anim);
	      });
	      this.requestScroll();
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

	  }, {
	    key: 'scale',
	    value: function scale(data) {
	      // Get the relative value (proportional to the min-max range you gave.)
	      var scaledValue = (data.to - data.from) * data.progress + data.from;
	      // Stick on the unit, if there is one.
	      var scaledValueString = data.unit ? scaledValue + data.unit : scaledValue;

	      // If it's a regular old style property, just replace the value. No fuss.
	      if (data.style.split(':').length === 1) {
	        data.node.style[data.style] = scaledValueString;
	        return;
	      }

	      /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
	      var transformProp = data.style.split(':')[1];
	      data.node.style.transform = getInjectedTransformString(data.node, transformProp, scaledValueString);
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

	  }, {
	    key: 'change',
	    value: function change(data) {
	      var newValue = data.progress < 0 ? null : data.to;

	      // If the progress is less than 0, we just need to nullify this style value.
	      if (data.progress < 0 && data.style === 'transition') {
	        data.node.addEventListener('transitionend', function (e) {
	          if (e.target === data.node) data.node.style[data.style] = null;
	        });
	        return;
	      }

	      // If it's a regular old style property, just replace the value. No fuss.
	      if (data.style.split(':').length === 1) {
	        data.node.style[data.style] = newValue;
	        return;
	      }

	      /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
	      var transformProp = data.style.split(':')[1];
	      data.node.style.transform = getInjectedTransformString(data.node, transformProp, newValue);
	    }
	  }, {
	    key: 'getCustomFunction',
	    value: function getCustomFunction(type) {
	      return this.customFunctions[type] || noop;
	    }
	  }, {
	    key: 'runAnimationsAt',
	    value: function runAnimationsAt(scrollPosition) {
	      this.animations.forEach(function (anim) {
	        var progress = anim.getProgressAt(scrollPosition);
	        if (progress >= 0 && progress <= 1) {
	          anim.runAt(progress);
	        } else if (anim.config.type === 'change') {
	          anim.runAt(-1);
	        }
	      });
	    }
	  }]);

	  return Choreographer;
	}();

	module.exports = Choreographer;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Animation = function () {
	  function Animation(config) {
	    _classCallCheck(this, Animation);

	    this.config = config;
	    this.nodes = Array.from(document.querySelectorAll(this.config.selector));
	  }

	  _createClass(Animation, [{
	    key: 'getProgress',
	    value: function getProgress(val, _ref) {
	      var _ref2 = _slicedToArray(_ref, 2);

	      var min = _ref2[0];
	      var max = _ref2[1];

	      return (val - min) / (max - min);
	    }

	    /** Returns the 'progress' - relative position within the animation range.
	      * If there are multiple ranges and the animation is within none of them,
	      * return -1.
	     **/

	  }, {
	    key: 'getProgressAt',
	    value: function getProgressAt(position) {
	      if (_typeof(this.config.range[0]) === 'object') {

	        var activeRange = void 0;

	        this.config.range.forEach(function (r) {
	          if (isBetween(postion, r[0], r[1])) activeRange = r;
	        });

	        if (!activeRange) return -1;else return this.getProgress(position, activeRange);
	      }

	      return this.getProgress(position, this.config.range);
	    }
	  }, {
	    key: 'runAt',
	    value: function runAt(progress) {
	      var _this = this;

	      this.nodes.forEach(function (node) {
	        var animate = _this.config.fn;
	        animate({
	          node: node,
	          style: _this.config.style,
	          from: _this.config.from,
	          to: _this.config.to,
	          unit: _this.config.unit,
	          progress: progress
	        });
	      });
	    }
	  }]);

	  return Animation;
	}();

	module.exports = Animation;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var translations = {
	  translateX: 0,
	  translateY: 1,
	  translateZ: 2
	};

	var scales = {
	  scaleX: 0,
	  scaleY: 1,
	  scaleZ: 2
	};

	var getInjectedTransformString = function getInjectedTransformString(node, prop, val) {
	  var _transform = arguments.length <= 3 || arguments[3] === undefined ? 'transform' : arguments[3];

	  // Get the node's previous transform value and store it.
	  var oldTransformString = node.style[_transform] || '';

	  var transform3dString = void 0;
	  var axis = void 0;
	  var xyz = void 0;

	  if (translations[prop]) {
	    axis = translations[prop];
	    prop = 'translate3d';
	    xyz = ['0', '0', '0'];

	    if (!val) val = 0;
	  } else if (scales[prop]) {
	    axis = scales[prop];
	    prop = 'scale3d';
	    xyz = ['1', '1', '1'];

	    if (!val) val = 1;
	  }

	  if (axis) {
	    if (oldTransformString.indexOf(prop) > -1) {
	      var startOfString = oldTransformString.split(prop + '(')[0];
	      var extractedValue = oldTransformString.split(prop + '(')[1].split(')')[0];
	      xyz = extractedValue.split(',');
	    }

	    xyz[axis] = val;
	    transform3dString = prop + '(' + xyz.join(',') + ')';
	  }

	  // Make a nice new string out of it with the scaled value.
	  var transformInjection = transform3dString || prop + '(' + val + ')';

	  var newTransformString = oldTransformString;

	  // Check if the new prop is already declared somehow in the old style value
	  var transformPropExists = oldTransformString.indexOf(prop) > -1;

	  // Because if it is, you don't want to add another copy.
	  if (transformPropExists) {
	    var _startOfString = oldTransformString.split(prop)[0];
	    var endOfString = oldTransformString.split(prop)[1].split(')')[1];
	    newTransformString = _startOfString + transformInjection + endOfString;
	  }
	  // In the same vein, if it isn't, you can't just replace the value because there might
	  // be some other transform properties hangin' out in there.
	  else newTransformString += ' ' + transformInjection;

	  return newTransformString;
	};

	module.exports = getInjectedTransformString;

/***/ }
/******/ ]);