const promises = []

export function registerCallback(cb) {
  promises.push(() => new Promise((res) => {
    cb(() => res())
  }))
}

export function registerPromise(p) {
  promises.push(p)
}

const signals = ['SIGINT', 'SIGTERM']

signals.forEach(SIG => {
  process.on(SIG, () => {
    console.log('\nStarting graceful shutdown...')
    Promise.all(promises.map(fn => fn())).then(() => {
      console.log('Gracefully shutted down.')
      process.exit(0)
    })
  })
})
