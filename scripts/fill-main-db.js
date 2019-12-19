'use strict';

require('dotenv').config({ path: process.cwd() + '/../.env' });
const knex = require('knex');
const { randomBytes } = require('crypto');

function randomStr(size = 16) {
  return randomBytes(size).toString('hex');
}

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const connectionString =
  `postgres://${DB_USER}:${DB_PASSWORD}@` +
  `${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
console.log(connectionString);

const RECORDS_COUNT = 3e4;

const randRng = (a, b) => a + Math.floor(Math.random() * (b - a));

const kn = knex({
  client: 'pg',
  connection: {
    connectionString
  }
});

const airports = Array(RECORDS_COUNT)
  .fill()
  .map(
    (_, index) => (
      (index += 1),
      {
        airport_name: `airport_name_${index}`,
        country: `country_name_${index}`,
        city: `city_name_${index}`
      }
    )
  );

const flights = Array(RECORDS_COUNT)
  .fill()
  .map(
    (_, index) => (
      (index += 1),
      {
        airport_id: index,
        plane_model: `plane_model_${index}`,
        departure_time: `01.01.1970`,
        departure_time: `12.31.2000`
      }
    )
  );

const clients = Array(RECORDS_COUNT / 50)
  .fill()
  .map(
    (_, index) => (
      (index += 1),
      {
        first_name: `first_name_${index}`,
        last_name: `last_name_${index}`,
        passport_id: `passport_id_${index}`,
        birth_date: `01.01.1970`,
        registered_time: `01.01.1970`
      }
    )
  );

const tickets = Array(RECORDS_COUNT)
  .fill()
  .map(
    (_, index) => (
      (index += 1),
      {
        class: 'economy',
        sub_class: 'W',
        ordered_by: Math.ceil(index / 50),
        flight_id: index,
        from_airp: randRng(0, RECORDS_COUNT) + 1,
        to_airp: randRng(0, RECORDS_COUNT) + 1,
        time: '01.01.1980',
        price: 100,
        booked: true,
        seat: 'A1'
      }
    )
  );
async function main() {
  await kn('clients').del();
  await kn('airports').del();

  await kn.raw(`
    ALTER SEQUENCE airports_airport_id_seq RESTART
  `);
  await kn.raw(`
    ALTER SEQUENCE flights_flight_id_seq RESTART
  `);
  await kn.raw(`
    ALTER SEQUENCE clients_client_id_seq RESTART
  `);
  await kn.raw(`
    ALTER SEQUENCE tickets_id_ticket_seq RESTART
  `);

  for (let i = 0; i < airports.length; i += 1e3) {
    await kn('airports')
      .insert(airports.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }
  for (let i = 0; i < flights.length; i += 1e3) {
    await kn('flights')
      .insert(flights.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }
  for (let i = 0; i < clients.length; i += 1e3) {
    await kn('clients')
      .insert(clients.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }
  for (let i = 0; i < tickets.length; i += 1e3) {
    await kn('tickets')
      .insert(tickets.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }

  console.log('Succseeded!');
  kn.destroy();
}

main();
