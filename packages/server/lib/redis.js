import redis from 'redis'
import { parse } from 'url'
import { promisify } from 'util'
import { registerCallback } from './gracefulShutdown'

const client = redis.createClient({
  host: process.env.REDIS_HOST
})

const rExists = promisify(client.exists.bind(client))
const rGet = promisify(client.get.bind(client))
const rSet = promisify(client.set.bind(client))

registerCallback(client.quit.bind(client), () =>
  console.log('Redis disconnected...')
)

export const s1CheckCache = async (req, res, next) => {
  res.type('application/json')
  const { query } = req.query
  if (!query) {
    res.code(400).send()
  }
  const exists = await rExists(query)
  if (exists) {
    res.code(200).send(Buffer.from(await rGet(query)))
  } else {
    return next()
  }
}

export const s1Cache = async (request, reply, res) => {
  // retrieve key for lookup in Redis
  const url = parse(request.url, true)
  const { query } = url.query

  // weird header is added, IDK why
  reply.type('application/json').removeHeader('transfer-encoding')

  const exists = await rExists(query)
  if (exists) {
    // pipe response to client, if cached
    reply.code(200).send(res)
  } else {
    // otherwise cache result if not exists
    let data = []
    res
      .on('data', ch => data.push(ch))
      .on('end', () => {
        const body = Buffer.concat(data)
        rSet(query, body)
        reply.code(200).send(body)
      })
  }
}

export const s2CheckCache = async (req, res, next) => {
  res.type('application/json')
  const { pathname } = parse(req.req.url)
  const [, , page] = pathname.split('/').filter(p => p.length)
  const KEY = `s2.${page}`

  const exists = await rExists(KEY)
  if (exists) {
    res.code(200).send(Buffer.from(await rGet(KEY)))
  } else {
    return next()
  }
}

export const s2Cache = async (request, reply, res) => {
  // retrieve key for lookup in Redis
  const { pathname } = parse(request.url, true)
  const [, , page] = pathname.split('/').filter(p => p.length)
  const KEY = `s2.${page}`

  // weird header is added, IDK why
  reply.type('application/json').removeHeader('transfer-encoding')

  const exists = await rExists(KEY)
  if (exists) {
    // pipe response to client, if cached
    reply.code(200).send(res)
  } else {
    // otherwise cache result if not exists
    let data = []
    res
      .on('data', ch => data.push(ch))
      .on('end', () => {
        const body = Buffer.concat(data)
        rSet(KEY, body)
        reply.code(200).send(body)
      })
  }
}
