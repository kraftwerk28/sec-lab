const redis = require('redis')
const fetch = require('node-fetch')

const client = redis.createClient({
  host: process.env.REDIS_HOST
})

Array(10).fill().forEach((_, page) => {
  fetch(`http://localhost:8080/s2/details/${page}`)
    .then(d => d.text())
    .then(data => {
      client.set(page, data)
    })
})
