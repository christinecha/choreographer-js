# Choreographer-js
A simple library to take care of complex CSS animations.
*(You can also add custom functions that do non-CSS animations!)*


## Quickstart

Install and save to your `package.json`:
```
$ npm install --save choreographer-js
```

Include it in your Javascript:
````js
const Choreographer = require('choreographer-js')
````


## Use Cases + Snippets

**Brew up some instant scroll animations.** This one would scale a box's `opacity` from `0` to `1` mirroring your scroll location from the top to `1000`. [Full Example >>](examples/one.html)
````js
let choreographer = new Choreographer({
  animations: [
    {
      range: [-1, 1000],
      selector: '#box',
      type: 'scale',
      style: 'opacity',
      from: 0,
      to: 1
    }
  ]
})

window.addEventListener('scroll', () => {
  choreographer.runAnimationsAt(window.pageYOffset)
})
````

**What about animations based on mouse movement?** This would make `#box` move `300px` down if your mouse was in the left-half of the browser window.
````js
let choreographer = new Choreographer({
  animations: [    
    {
      range: [-1, window.innerWidth / 2],
      selector: '#box',
      type: 'change',
      style: 'transform:translateY',
      to: 300,
      unit: 'px'
    }
  ]
})

document.body.addEventListener('mousemove', (e) => {
  choreographer.runAnimationsAt(e.clientX)
})
````


## Get Started
You can simply install the package via npm:
```
$ npm install --save choreographer-js
```
Or if you're keeping things super simple, just include [this file](dist/choreographer.min.js) as a script like so:
````html
<script src="your_path/choreographer.min.js"></script>
````

Cool! Now you can create an instance of Choreographer like this, and run the animations based on whatever measurement floats your boat (ex. scroll position, mouse position, timestamp, whatever).
````js
let choreographer = new Choreographer(config)
choreographer.runAnimationsAt(position)
````

More often than not, you'll probably want to wrap that `runAnimationsAt` function in another, like an event handler, for instance:
````js
window.addEventListener('scroll', () => {
  // then, use the scroll position (pageYOffset) to base the animations off of
  choreographer.runAnimationsAt(window.pageYOffset)
})
````

More detailed documentation below.

## Full API Reference

### `Choreographer`

`[Class]` | The home base for everything.

construction:  
`new Choreographer(` [`choreographerConfig`](#choreographerconfig) `)`

public methods:
- [`this.updateAnimations`](#update-animations)
- [`this.runAnimationsAt`](#run-animations-at)

---

### `choreographerConfig`

`[Object]` | The object used to configure an instance of Choreographer.

example structure:
```
{
  customFunctions: {
    [animation type]: [animationFunction]
  },
  animations: [ animationConfig, animationConfig, ... ]
}
```
related references: [`animationFunction`](#animationfunction), [`animationConfig`](#animationconfig)

---

### `Choreographer.updateAnimations([ Array of` [`animationConfig`](#animationconfig) `])`

`[Function]` | Replace `this.animations` with a new Array of `Animations`.

---

### `Choreographer.runAnimationsAt([ Number ])`

`[Function]` | Run the animations at a given location marker.

---

### `Animation`

`[Class]` | The class that manages each animation's data.

construction:  
`new Animation(` [`animationConfig`](#animationconfig) `)`

---

### `animationConfig`

`[Object]` | The object used to configure an instance of Animation.

example structure:
```
{
  range: [0, 100],
  selector: '.box',
  type: 'scale',
  fn: [animationFunction],
  style: 'width',
  from: 0,
  to: 100,
  unit: '%'
}
```

**`range`** | `[Array of Number]` or `[Array of Array of Number]`  
Either a one- or two-dimensional array of ranges, i.e. [0,5] or [[0,3], [4,5]]  
*NOTE: Bugs will occur if you overlap animation ranges that affect the same style properties!*

**`type`** | `[String]`  
The name of the animation function

**`fn`** | `[animationFunction]`
see `animationFunction`](#animationfunction)

**`selector`** | `[String]`  
A valid DOM Element selector string, ex. '.classname' or '#box .thing[data-attr=true]'

**`selectors`** | `[Array]`
An array of selector strings (as described above).

*NOTE: Only one of the below (selector or selectors) is necessary. If they both exist, 'selectors' will be used.*

**`style`** | `[String]`
A valid CSS style property.
*NOTE: If you are using 'transform', follow it with a colon and the property name, ex. 'transform:scaleX'*

**`from`** | `[Number]`  
The minimum value to set to the style property. Useful when progressively calculating a value.

**`to`** | `[Number or String]`
If you want progressively calculated (scaled) values, this has to be a **number**. Otherwise, if for something a 'change' animation, this can be a string - whatever the valid type for the relevant `style` property is.

related references: [`animationFunction`](#animationfunction)

---

### `animationFunction`

`[Function]` | A function that takes animation data and does something with it.

example:
````js
// randomize the color of a given node
(data) => {
  const chars = '0123456789abcdef'.split('')
  let hex = '#'

  while (hex.length < 7) {
    hex += chars[Math.round(Math.random() * (chars.length - 1))]
  }

  data.node.style.color = hex
}
````

arguments: [`animationData`](#animationData)

---

### `animationData`

`[Object]` | This is the data passed into an `animationFunction`. A lot of it is taken directly from `animationConfig`.

Structure:
```
{
  node: [DOM Element] | the element this animation will affect,
  progress: [Number]  | a number representing the relative location of a node within a range,

  // these are all taken directly from the animationConfig
  style: (see above),
  from: (see above),
  to: (see above),
  unit: (see above),
}
```

**`Progress` is what allows for progressive scaling of values (ex. smooth fading of opacity, 2d translation, etc.)**
If the value is between 0 and 1, that means you are within a range (given in animationConfig).

---



## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
## History
TODO: Write history
## Credits
TODO: Write credits
## License
TODO: Write license
