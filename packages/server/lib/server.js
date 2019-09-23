import fastify from 'fastify'

import { registerPromise } from './gracefulShutdown'
import { connect } from './db'
import * as routes from './router'

const app = fastify({})

const { SERVER_PORT } = process.env

app.get('/', routes.index)
app.post('/add-airport', routes.addAirport)
app.post('/add-ticket', routes.addTicket)
app.post('/add-client', routes.addClient)
app.post('/add-flight', routes.addFlight)

Promise.all([
  app.listen(SERVER_PORT),
  connect()
]).then(() => console.log('Server working'))

registerPromise(app.close.bind(app), () => console.log('Server closed...'))
