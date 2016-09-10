const Choreographer = require('../dist')

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
