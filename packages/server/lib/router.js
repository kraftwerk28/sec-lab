import * as db from './db'

const dbOk = result => ({ status: 'ok', rowsAffected: result.rowCount })
const dbErr = error => ({ status: 'error', error: error })

export const index = (req, res) => {
  res.status(200).send({ status: 'ok' })
}

export const addAirport = (req, res) => {
  db.addAirport(req.body)
    .then((result) => res.status(200).send(dbOk(result)))
    .catch((err) => res.status(500).send(dbErr(err)))
}

export const addTicket = (req, res) => {
  db.addTicket(req.body)
    .then((result) => res.status(200).send(dbOk(result)))
    .catch((err) => res.status(500).send(dbErr(err)))
}

export const addClient = (req, res) => {
  db.addTicket(req.body)
    .then((result) => res.status(200).send(dbOk(result)))
    .catch((err) => res.status(500).send(dbErr(err)))
}

export const addFlight = (req, res) => {
  db.addFlight(req.body)
    .then((result) => res.status(200).send(dbOk(result)))
    .catch((err) => res.status(500).send(dbErr(err)))
}
