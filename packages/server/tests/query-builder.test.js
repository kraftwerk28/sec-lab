import QB from '../lib/query-builder'

const qb = new QB()

qb.select('kek', ['hello', 'world']).where('hello = 12')

console.log(qb)
