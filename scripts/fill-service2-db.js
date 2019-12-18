'use strict';

require('dotenv').config({ path: process.cwd() + '/../.env' });
const knex = require('knex');
const { randomBytes } = require('crypto');

const randRng = (a, b) => a + Math.floor(Math.random() * (b - a));

function randomStr(size = 16) {
  return randomBytes(size).toString('hex');
}

const { DB_HOST, DB_PORT, S2_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const connectionString =
  `postgres://${DB_USER}:${DB_PASSWORD}@` +
  `${DB_HOST}:${DB_PORT}/${S2_DATABASE}`;
console.log(connectionString);

const RECORDS_COUNT = 25_000;

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

const tickets = Array(RECORDS_COUNT)
  .fill()
  .map(
    (_, index) => (
      (index += 1),
      {
        id_ticket: index,
        from_airp: randRng(0, RECORDS_COUNT) + 1,
        to_airp: randRng(0, RECORDS_COUNT) + 1,
        price: 100,
        time: '01.01.1970',
        seat: index % 100
      }
    )
  );
async function main() {
  await kn('ticket').del();
  await kn('airports').del();

  await kn.raw(`
    ALTER SEQUENCE airports_airport_id_seq RESTART
  `);

  for (let i = 0; i < airports.length; i += 1e3) {
    await kn('airports')
      .insert(airports.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }
  for (let i = 0; i < tickets.length; i += 1e3) {
    await kn('ticket')
      .insert(tickets.slice(i, i + 1e3))
      .then(_ => {}, console.error);
  }

  console.log('Succseeded!');
  kn.destroy();
}

main().catch(reason => {
  console.error(reason);
  process.exit(1);
});
