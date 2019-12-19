const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const withQuery = (q, data) => pool.query(q, data);

exports.addReserv = (clientId, ticketId, time, service) =>
  withQuery(
    `
      INSERT INTO reservations
      (client_id, ticket_id, reservation_time, service)
      VALUES ($1, $2, $3, $4)
    `,
    [clientId, ticketId, time, service]
  );

exports.getReserv = () =>
  withQuery(
    `SELECT * FROM reservations`
  );
