const promises = []

export function registerCallback(cb, callback = () => {}) {
  promises.push(() => new Promise((res) => {
    cb(() => {
      res()
      callback()
    })
  }))
}

export function registerPromise(p, callback = () => {}) {
  promises.push(async () => {
    await p()
    callback()
  })
}

const signals = ['SIGINT', 'SIGTERM']

signals.forEach(SIG => {
  process.on(SIG, () => {
    console.log(`\nStarting graceful shutdown with ${promises.length} agents...`)
    Promise.all(promises.map(fn => fn())).then(() => {
      console.log('Gracefully shutted down.')
      process.exit(0)
    })
  })
})
