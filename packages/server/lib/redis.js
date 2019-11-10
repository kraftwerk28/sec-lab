import redis from 'redis'

const client = redis.createClient()

export const end = () =>
  new Promise(res => {
    client.quit(res)
  })

client.set('lol', 'kek', () => {
  client.set('abc', '123', () => {
    client.keys('*', (...vals) => console.log(vals))
    client.quit()
  })
})
