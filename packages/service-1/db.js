'use strict'

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

const query = `
  SELECT id_ticket, price, time, seat,
    from_a.airport_name AS from_name,
    from_a.country AS from_country,
    from_a.city AS from_city,
    to_a.airport_name AS to_name,
    to_a.country AS to_country,
    to_a.city AS to_city
  FROM
    ticket t JOIN airports from_a
    ON t.from_airp = from_a.airport_id
    JOIN airports to_a
    ON t.to_airp = to_a.airport_id
  WHERE
    (from_a.airport_name = $1 OR $1 ISNULL) AND
    (to_a.airport_name = $2 OR $2 ISNULL) AND
    (time = $3 OR $3 ISNULL) AND
    (price < $4 OR $4 ISNULL)
`

const select = conditions =>
  pool
    .query(query, [
      conditions.from,
      conditions.to,
      conditions.time,
      conditions.maxPrice
    ])
    .then(data => data.rows)

module.exports = select
