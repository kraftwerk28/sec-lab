import * as db from './db'

const dbOk = result => ({ status: 'ok', ...result })
const dbErr = error => ({ status: 'error', error: error })

export const index = (req, res) => {
  res.status(200).send({ status: 'ok' })
}

export const addAirport = (req, res) => {
  db.addAirport(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)))
}

export const addTicket = (req, res) => {
  db.addTicket(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)))
}

export const addClient = (req, res) => {
  db.addTicket(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)))
}

export const addFlight = (req, res) => {
  db.addFlight(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)))
}

export const getTickets = (req, res) => {
  db.getTickets().then(data => res.status(200).send(dbOk({ data })))
}

export const getAirports = (req, res) => {
  db.getAirports().then(data => res.status(200).send(dbOk({ data })))
}

export const getClients = (req, res) => {
  db.getClients().then(data => res.status(200).send(dbOk({ data })))
}

export const getFlights = (req, res) => {
  db.getFlights().then(data => res.status(200).send(dbOk({ data })))
}
