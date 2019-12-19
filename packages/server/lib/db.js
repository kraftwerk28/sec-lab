import QueryBuilder from './query-builder';
import { registerPromise } from './gracefulShutdown';

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = process.env;

const qb = new QueryBuilder({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});

export const connect = () => qb.connect();

export const disconnect = () => qb.end();

export const addTicket = async (ticket) => qb.insert('tickets', ticket).exec();
export const addAirport = (airport) => qb.insert('airports', airport).exec();
export const addFlight = (flight) => qb.insert('flights', flight).exec();
export const addClient = (client) => qb.insert('clients', client).exec();

// export const getJoined = () => qb.
export const getTickets = () => qb.select('tickets', '*').execRows();
export const getAirports = () => qb.select('airports', '*').execRows();
export const getClients = () => qb.select('clients', '*').execRows();
export const getFlights = () => qb.select('flights', '*').execRows();

registerPromise(disconnect, () => console.log('Database disconnected...'));
