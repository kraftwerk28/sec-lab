'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tickets_service_2',
  user: 'postgres',
  password: '790000'
});

const listQuery = 'SELECT * FROM ticket';

const byIDQuery = `
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
  WHERE id_ticket = $1
`;

const list = () => pool.query(listQuery).then(data => data.rows); 

const byID = id => pool.query(byIDQuery, [id]).then(data => data.rows);

module.exports = { list, byID };
