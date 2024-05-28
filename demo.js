const { TermInfo, Screen } = require('.')
const ti = TermInfo.forCurrentTerminal()
const screen = new Screen(ti)
screen.setMouseEnabled(true)
screen.setCursorVisible(false)
screen.start()

let particles = []

process.stdin.on('data', (d) => {
  if (d[0] === 3) {
    screen.stop()
    process.exit(0)
  }
  const m = /^\x1b\[M(.)(.)(.)$/.exec(d)
  if (m) {
    const [,,,btn, cx, cy] = d
    const x = cx - 32 - 1
    const y = cy - 32 - 1
    const btnsDown = btn & 0x23
    if (btnsDown === 32) {
      for (let i = 0; i < 4 + Math.random() * 5; i++)  {
        particles.push({
          x, y,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          chr: '*'
        })
      }
    }
  }
})

function update() {
  const dt = 0.5
  const [width, height] = process.stdout.getWindowSize()
  for (const p of particles) {
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 0.1 * dt
  }
  particles = particles.filter(p => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height)
}

function draw() {
  screen.clear()
  for (const p of particles) {
    screen.put(p.x, p.y, p.chr)
  }
}

function frame() {
  update()
  draw()
}

setInterval(frame, 1000/30)
