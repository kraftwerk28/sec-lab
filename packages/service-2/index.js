'use strict'

const { resolve } = require('path')
require('dotenv').config({ path: resolve(process.cwd(), '../../', '.env') })
const http = require('http')
const url = require('url')

const { list, byID } = require('./db')

const { SERVICE2_PORT } = process.env
const PORT = SERVICE2_PORT || 8000

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url, true).pathname

  if ((pathname === '/price-list/') | (pathname === '/price-list')) {
    list().then(tickets => res.end(JSON.stringify(tickets)))
  } else if (pathname.match(/\/details\/.*/)) {
    const id = pathname.slice(9)
    byID(id).then(tickets => res.end(JSON.stringify(tickets)))
  } else {
    res.writeHead(400).end()
  }
})

server.listen(PORT)
