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

var transformKeys = {
  'transform': 'transform',
  'webkitTransform': '-webkit-transform',
  'MozTransform': '-moz-transform',
  'msTransform': '-ms-transform',
  'OTransform': '-o-transform'
};

// Get the correct transform key value, either plain 'transform' or a prefixed one.
var getTransformKey = function getTransformKey() {
  if (!window.getComputedStyle) return null;

  var el = document.createElement('div');
  document.body.insertBefore(el, null);

  for (var t in transformKeys) {
    if (window.getComputedStyle(el)[t]) {
      document.body.removeChild(el);
      return t;
    }
  }

  document.body.removeChild(el);
  return null;
};

// Check if we have 3d support
var getHas3d = function getHas3d() {
  if (!transformKey) return false; // No transform, no 3d. GET A NEW BROWSER YO

  var el = document.createElement('div');
  document.body.insertBefore(el, null);
  el.style[transformKey] = 'translate3d(1px,1px,1px)';

  var has3d = !!window.getComputedStyle(el).getPropertyValue(transformKey);
  document.body.removeChild(el);

  return has3d;
};

// Cache these values
var transformKey = getTransformKey();
var has3d = getHas3d();

var getInjectedTransformString = function getInjectedTransformString(node, prop, val) {

  // If your browser doesn't support even prefixed transforms... get a new browser. Bye.
  if (!transformKey) return;

  // Get the node's previous transform value and store it.
  var oldTransformString = node.style[transformKey] || '';

  // set up variable declarations for 3d stuff
  var transform3dString = void 0;
  var axis = void 0;
  var xyz = void 0;

  // If we've got 3d, then USE IT! It's sooo much smoother. #blessed
  if (has3d) {

    // If it's a translate or scale, we can 3d-ify that. (I know there's some duplication but I'd rather be explicit here.)

    // Axis is the index of the value we'll want to change (X is 0, Y is 1, Z is 3)
    // Prop is the name of the property
    // XYZ holds our actual values.
    if (translations[prop] !== undefined) {
      axis = translations[prop];
      prop = 'translate3d';
      xyz = ['0', '0', '0'];
      if (val === null) val = 0;
    } else if (scales[prop] !== undefined) {
      axis = scales[prop];
      prop = 'scale3d';
      xyz = ['1', '1', '1'];
      if (val === null) val = 1;
    }

    // If everything checks out, we should have our values set!
    if (axis !== undefined) {
      if (oldTransformString.indexOf(prop) > -1) {
        var startOfString = oldTransformString.split(prop + '(')[0];
        var extractedValue = oldTransformString.split(prop + '(')[1].split(')')[0];
        xyz = extractedValue.split(',');
      }

      // Replace the value in the array, then join that sucker together.
      xyz[axis] = val;
      transform3dString = prop + '(' + xyz.join(',') + ')';
    }
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