const { Screen } = require('..')
const { Vec3, Mat44 } = require('./linalg')

const screen = new Screen
screen.setCursorVisible(false)
screen.start()
process.on('exit', () => screen.stop())
screen.on('key', (b) => {
  if (b[0] === 3) process.exit()
})

const cube = [
  [new Vec3(-1, -1, -1), new Vec3(-1, -1, 1)],
  [new Vec3(-1, -1, -1), new Vec3(-1, 1, -1)],
  [new Vec3(-1, -1, -1), new Vec3(1, -1, -1)],

  [new Vec3(-1, -1, 1), new Vec3(-1, 1, 1)],
  [new Vec3(-1, -1, 1), new Vec3(1, -1, 1)],

  [new Vec3(-1, 1, -1), new Vec3(-1, 1, 1)],
  [new Vec3(-1, 1, -1), new Vec3(1, 1, -1)],

  [new Vec3(1, -1, -1), new Vec3(1, -1, 1)],
  [new Vec3(1, -1, -1), new Vec3(1, 1, -1)],

  [new Vec3(-1, 1, 1), new Vec3(1, 1, 1)],
  [new Vec3(1, -1, 1), new Vec3(1, 1, 1)],
  [new Vec3(1, 1, -1), new Vec3(1, 1, 1)],
]

function lerp(a, b, t) {
  return a.scale(1-t).add(b.scale(t))
}

const proj = Mat44.scale(3, 1, 1).mul(Mat44.perspective(Math.PI/4, 80/24, 0.1, 10))
const camera = Mat44.translate(0, 0, 3)
let rot = [0, 0, 0]

  /*
for (const [a, b] of cube) {
  console.log(a, proj.mul(a))
  console.log(b, proj.mul(b))
}
*/

function update(dt) {
  rot[0] += dt / 800
  rot[1] += dt / 900
  rot[2] += dt / 700
}

function draw() {
  // General approach: each pair of vectors in `cube` represents a line
  // segment. For each line segment, sample several points along the segment,
  // project them into screen space, and draw the resulting point.

  screen.clear()
  const r = Mat44.rotate(0, 1, 0, rot[0]).mul(Mat44.rotate(0, 0, 1, rot[1])).mul(Mat44.rotate(1, 0, 0, rot[2]))
  for (const [a, b] of cube) {
    for (let i = 0; i <= 15; i++) {
      const p = lerp(a, b, i / 15)
      const p2 = proj.mul(camera.mul(r.mul(p))).add(new Vec3(40, 12, 0))
      if (p2.x >= 0 && p2.y >= 0)
        screen.put(p2.x, p2.y, '#')
    }
  }
}

setInterval(() => {
  update(1000 / 30)
  draw()
}, 1000/30)
