import fastify from 'fastify'
import fastifyProxy from 'fastify-http-proxy'

import { registerPromise } from './gracefulShutdown'
import { connect } from './db'
import * as routes from './router'

const app = fastify()

const { SERVICE1_PORT, SERVICE2_PORT } = process.env

app.register(fastifyProxy, {
  upstream: `http://127.0.0.1:${SERVICE1_PORT}`,
  prefix: '/s1',
  preHandler(req, res, next) {
    console.log('Service 1 proxy...')
    return next()
  }
})
app.register(fastifyProxy, {
  upstream: `http://127.0.0.1:${SERVICE2_PORT}`,
  prefix: '/s2',
  preHandler(req, res, next) {
    console.log('Service 2 proxy...')
    return next()
  }
})

const { SERVER_PORT } = process.env
const PORT = SERVER_PORT || 8080

app.get('/', routes.index)
app.get('/get-airports', routes.getAirports)
app.get('/get-tickets', routes.getTickets)
app.get('/get-clients', routes.getClients)
app.get('/get-flights', routes.getFlights)

app.post('/add-airport', routes.addAirport)
app.post('/add-ticket', routes.addTicket)
app.post('/add-client', routes.addClient)
app.post('/add-flight', routes.addFlight)

app.get('/test/:id1/:id2', (req, res) => {
  console.log(req.params, req.query)
  res.status(200).send('ok')
})

app
  .listen({ host: '0.0.0.0', port: PORT })
  .then(() => console.log(`Server working on port :${PORT}`))

connect().then(() => console.log('Connected to database...'))

registerPromise(app.close.bind(app), () => console.log('Server closed...'))
