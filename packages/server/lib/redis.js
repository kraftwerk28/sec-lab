import redis from 'redis'
import { parse } from 'url'
import { promisify } from 'util'
import { registerCallback } from './gracefulShutdown'

const client = redis.createClient()

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
