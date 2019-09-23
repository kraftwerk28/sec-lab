import QB from '../lib/query-builder'
import assert from 'assert'

const qb = new QB()

qb.select('foo', ['hello', 'world']).where('hello = 12')

// query building structures
assert.strictEqual(qb._query, 'SELECT $1, $2 FROM foo WHERE hello = 12')
assert.deepStrictEqual(qb._values, ['hello', 'world'])

console.log('Tests ok.')
