import fastify from 'fastify'

import { registerPromise } from './gracefulShutdown'

const app = fastify({})

const { PORT } = process.env

app.get('/', async (req, res) => {
  res.status(200).headers({
    'content-type': 'application/json'
  }).send({ hello: 'world' })
})

app.post('/test', (req, res) => {
  const { query } = req.body
  return res.graphql(query)
})

app
  .listen(PORT)
  .then(() => {
    console.log(`Server listening on :${PORT}`)
  })
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })

registerPromise(app.close.bind(app))
