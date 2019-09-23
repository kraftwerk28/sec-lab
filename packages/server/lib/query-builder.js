import { Pool } from 'pg'

// const Q_OPS = ['>=', '<=', '<>', '>', '<']
const Q_CREATORS = {
  SELECT: qb => {
    const q = [
      `SELECT ${$seq(qb._values.length)}`,
      `FROM ${qb._table}`
    ]
    if (qb._whereClause) q.push(`WHERE ${qb._whereClause}`)
    return q.join(' ')
  },
  INSERT: qb => {
    const q = [
      `INSERT INTO ${qb._table}`,
      `(${qb._keys.join(', ')})`,
      `VALUES (${$seq(qb._values.length)})`
    ]
    if (qb._whereClause) q.push(`WHERE ${qb._whereClause}`)
    return q.join(' ')
  }
}

const $seq = cnt => Array(cnt).fill().map((_, idx) => '$' + (idx + 1)).join(', ')

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
    this._query = constructQuery(this)
    return this
  }

  where(conditions) {
    this._whereClause = conditions
    this._query = constructQuery(this)
    return this
  }

  insert() {
    this._opertaion = 'INSERT'
    return this
  }

  update() {
    return this
  }

  connect() {
    return this._pool.connect().then(client => {
      this._client = client
      return this._client
    })
  }

  exec() {
    // TODO: implement
    this._client.query(this._query, this._queryValues)
  }

  end() {
    return this._pool.end()
  }
}

export default QueryBuilder
