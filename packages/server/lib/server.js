import fastify from 'fastify'

const app = fastify({})

app.get('/', async (req, res) => {
  res.status(200).headers({
    'content-type': 'application/json'
  }).send({ hello: 'world' })
})

app.listen(8080, () => console.log('Listening...'))
