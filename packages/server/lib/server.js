import fastify from 'fastify'

import { registerPromise } from './gracefulShutdown'
import { connect } from './db'
import * as routes from './router'

const app = fastify()

const { SERVER_PORT } = process.env

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
  .listen({ host: '0.0.0.0', port: SERVER_PORT })
  .then(() => console.log(`Server working on port :${SERVER_PORT}`))

connect().then(() => console.log('Connected to database...'))

registerPromise(app.close.bind(app), () => console.log('Server closed...'))
