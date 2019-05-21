const util = require('util')
process.stdin.setRawMode(true)
process.stdout.write('\x1b[?1000h')
process.stdin.on('data', (e) => {
  console.log(util.inspect(e))
  if (e[0] === 3) {
    process.stdout.write('\x1b[?1000l')
    process.stdin.setRawMode(false)
    process.exit(0)
  }
})
