import { Pool } from 'pg'

// const Q_OPS = ['>=', '<=', '<>', '>', '<']
const Q_CREATORS = {
  SELECT: qb => {
    let valPlaceholder = ''
    if (qb._values === '*' || qb._values.includes('*')) {
      valPlaceholder = '*'
      qb._values = []
    } else {
      valPlaceholder = $seq(qb._values.length)
    }
    const q = [`SELECT ${valPlaceholder}`, `FROM ${qb._table}`]
    if (qb._whereClause) q.push(`WHERE ${qb._whereClause}`)
    q.push('LIMIT 100')
    return q.join(' ')
  },
  INSERT: qb => {
    let valPlaceholder = ''
    if (qb._values === '*' || qb._values.includes('*')) {
      valPlaceholder = '*'
      qb._values = []
    } else {
      valPlaceholder = $seq(qb._values.length)
    }
    const q = [
      `INSERT INTO ${qb._table}`,
      `(${qb._keys.join(', ')})`,
      `VALUES (${valPlaceholder})`
    ]
    if (qb._whereClause) q.push(`WHERE ${qb._whereClause}`)
    return q.join(' ')
  }
}

const $seq = cnt =>
  Array(cnt)
    .fill()
    .map((_, idx) => '$' + (idx + 1))
    .join(', ')

const constructQuery = qb => Q_CREATORS[qb._opertaion](qb)

class QueryBuilder {
  constructor(dbConfig) {
    this._pool = new Pool(dbConfig)
    this._client = null
    this._table = undefined
    this._opertaion = undefined
    this._whereClause = ''
    this._values = []
    this._keys = []
    this._query = ''
  }

  select(table, values) {
    this._table = table
    this._opertaion = 'SELECT'
    this._values = values
    return this
  }

  where(conditions) {
    this._whereClause = conditions
    return this
  }

  insert(table, data) {
    this._opertaion = 'INSERT'
    this._table = table
    this._keys = Object.keys(data)
    this._values = Object.values(data)
    return this
  }

  update() {
    return this
  }

  connect() {
    return this._pool.connect().then(
      client => {
        this._client = client
        return this._client
      },
      err => {
        console.error('Failed creating pool client.', err)
        process.exit(1)
      }
    )
  }

  exec() {
    this._query = constructQuery(this)
    return this._client.query(this._query, this._values).catch(e => {
      this._client.release()
      return Promise.reject(e)
    })
  }

  execRows() {
    return this.exec().then(r => r.rows)
    // this._query = constructQuery(this)
    // return this._client.query(this._query, this._values)
    //   .catch(e => Promise.reject(e))
  }

  flushQuery() {
    this._query = constructQuery(this)
  }

  end() {
    try {
      this._client.release()
    } catch (e) {
      console.log('Client already released, skipping...')
    }
    return this._pool.end()
  }
}

export default QueryBuilder
