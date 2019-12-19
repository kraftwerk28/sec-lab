const knex = require('knex');
const {
  DB_HOST,
  DB_DATABASE,
  S1_DATABASE,
  S2_DATABASE,
  DB_PORT,
  DB_USER,
  DB_PASSWORD
} = process.env;

console.log(DB_DATABASE, S1_DATABASE, S2_DATABASE);

const DEFAULT_CONNECTION = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD
};

const knMain = knex({
  connection: {
    ...DEFAULT_CONNECTION,
    database: DB_DATABASE
  },
  client: 'pg'
});
const knS1 = knex({
  connection: {
    ...DEFAULT_CONNECTION,
    database: S1_DATABASE
  },
  client: 'pg'
});
const knS2 = knex({
  connection: {
    ...DEFAULT_CONNECTION,
    database: S2_DATABASE
  },
  client: 'pg'
});

const disconnect = async () => {
  await Promise.all([
    knMain.destroy(),
    knS1.destroy(),
    knS2.destroy(),
  ]);
};

module.exports = {
  knMain,
  knS1,
  knS2,
  disconnect
};
