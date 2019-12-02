import { URL, URLSearchParams } from 'url'
import fetch from 'node-fetch'

import * as db from './db'

const { SERVER_PORT } = process.env
const PORT = SERVER_PORT || 8080
const S2_LIST_LIMIT = 120

const dbOk = result => ({ status: 'ok', ...result })
const dbErr = error => ({ status: 'error', error: error })

const s1Search = async req => {
  const clauses = req.body

  const s1Query = Object.keys(clauses)
    .map(key => `${key}:${clauses[key]}`)
    .join(',')
  const url = new URL('http://localhost')
  const query = new URLSearchParams({
    query: s1Query
  })
  url.port = PORT
  url.pathname = '/s1/search'
  url.search = query

  return fetch(url, {
    method: 'GET'
  }).then(res => res.json())
}

const s2Search = async req => {
  const makePageRequest = async (req, array, curPage) => {
    if (array.length > S2_LIST_LIMIT) return array
    const url = new URL('http://localhost')
    url.port = PORT
    url.pathname = '/s2/price-list/' + curPage
    const data = await fetch(url, { method: 'GET' }).then(d => d.json())
    if (data.length) {
      return makePageRequest(req, array.concat(data), curPage + 1)
    } else {
      return array
    }
  }

  const CLAUSE_MAP = {
    from: 'from_airp',
    to: 'to_airp',
    time: 'time',
    maxPrice: 'price'
  }
  const entities = await makePageRequest(req, [], 0)
  const clauses = req.body

  return entities.filter(ticket =>
    // iterate over each clause in QUERY
    Object.keys(clauses).some(clause => {
      if (!CLAUSE_MAP[clause]) return false
      // map QUERY clause to database specific FIELD
      const field = CLAUSE_MAP[clause]
      if (!ticket[field]) return false
      return ticket[field].toString().match(new RegExp(clauses[clause], 'i'))
    })
  )
}

const mainSearch = async req => {
  const url = new URL('http://localhost')
  url.port = PORT
  url.pathname = '/get-tickets'

  const CLAUSE_MAP = {
    from: 'from_airp',
    to: 'to_airp',
    time: 'time',
    maxPrice: 'price'
  }

  const entities = await fetch(url, {
    method: 'GET'
  }).then(res => res.json())
  const clauses = req.body
  
  return entities.data.filter(ticket => {
    Object.keys(clauses).some(clause => {
      if (!CLAUSE_MAP[clause]) return false
      const field = CLAUSE_MAP[clause]
      if (!ticket[field]) return false
      return ticket[field].toString().match(new RegExp(clauses[clause], 'i'))
    })
  })
}

const filterData = (req, data) => {
  const clauses = req.body

  return data.filter(ticket =>
    // iterate over each clause in QUERY
    Object.keys(clauses).some(clause => {
      if (!CLAUSE_MAP[clause]) return false
      // map QUERY clause to database specific FIELD
      return CLAUSE_MAP[clause].some(field => {
        // if MAPPED field of ticket matches clause in QUERY
        // for example `from` in clause means `from_name` OR `from_airp` in TICKET
        if (!ticket[field]) return false
        return ticket[field].toString().match(new RegExp(clauses[clause], 'i'))
      })
    })
  )
}

export const index = (req, res) => {
  res.status(200).send(dbOk())
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

export const search = async (req, res) => {
  const s1Res = s1Search(req)
  const s2Res = s2Search(req)
  const mainRes = mainSearch(req)

  Promise.all([s1Res, s2Res, mainRes])
    .then(([s1 = [], s2 = [], main = []]) => {
      const data = main.concat(s1, s2)
      res.code(200).send(dbOk({ data }))
    })
    .catch(e => {
      res.code(400).send(dbErr(e))
    })
}
