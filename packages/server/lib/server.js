import fastify from 'fastify'
import fastifyProxy from 'fastify-http-proxy'

import { registerPromise } from './gracefulShutdown'
import { connect } from './db'
import * as r from './router'
import * as redis from './redis'

const app = fastify({ logger: process.env.NODE_ENV === 'development' && false })

const { SERVICE1_PORT, SERVICE2_PORT, RESERV_PORT } = process.env

app.use('/auth', r.withAuth)

app.register(fastifyProxy, {
  upstream: `http://127.0.0.1:${SERVICE1_PORT}`,
  prefix: '/s1',
  preHandler: redis.s1CheckCache,
  replyOptions: { onResponse: redis.s1Cache }
})

app.register(fastifyProxy, {
  upstream: `http://127.0.0.1:${SERVICE2_PORT}`,
  prefix: '/s2',
  preHandler: redis.s2CheckCache,
  replyOptions: { onResponse: redis.s2Cache }
})

app.register(fastifyProxy, {
  upstream: `http://127.0.0.1:${RESERV_PORT}`,
  prefix: '/auth/reserve'
})

const { SERVER_PORT } = process.env
const PORT = SERVER_PORT || 8080


app.get('/', r.index)
app.get('/get-airports', r.getAirports)
app.get('/get-tickets', r.getTickets)
app.get('/get-clients', r.getClients)
app.get('/get-flights', r.getFlights)

app.post('/add-airport', r.addAirport)
app.post('/add-ticket', r.addTicket)
app.post('/add-client', r.addClient)
app.post('/add-flight', r.addFlight)

app.post('/search', r.search)

app.post('/login', r.login)

app.post('/auth/test', r.authTest)

app
  .listen({ host: '0.0.0.0', port: PORT })
  .then(() => console.log(`Server working on port :${PORT}`))

connect().then(() => console.log('Connected to database...'))

registerPromise(app.close.bind(app), () => console.log('Server closed...'))
