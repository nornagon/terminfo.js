const { Screen } = require('..')
const { Vec3, Mat44 } = require('./linalg')

const screen = new Screen
screen.start()
process.on('exit', () => screen.stop())
screen.on('key', (b) => {
  if (b[0] === 3) process.exit()
})

const cube = [
  [new Vec3(-1, -1, -1), new Vec3(1, -1, -1)],
  // ...
]

const proj = Mat44.perspective(Math.PI/4, 80/24, 0.1, 10)

function update(dt) {
}

function draw() {
  // General approach: each pair of vectors in `cube` represents a line
  // segment. For each line segment, sample several points along the segment,
  // project them into screen space, and draw the resulting point.

  // screen.put(...)
}

setInterval(() => {
  update(1000 / 30)
  draw()
}, 1000/30)
