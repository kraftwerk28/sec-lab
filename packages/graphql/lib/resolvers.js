const db = require('./db');

exports.ticketResolver = async (parent, { id }) => {
  let tickets;
  if (id) {
    tickets = await db
      .knMain('tickets')
      .select('*')
      .where({ id_ticket: id ? id : undefined })
      .limit(10)
      .catch(console.error);
  } else {
    tickets = await db
      .knMain('tickets')
      .select('*')
      .where({ id_ticket: id ? id : undefined })
      .limit(10)
      .catch(console.error);
  }
  return tickets;
};

exports.flightTicketsResolver = async flight => {
  const tickets = await db
    .knMain('tickets')
    .select('*')
    .where({ flight_id: flight.flight_id })
    .limit(10);
  return tickets;
};

exports.flightsResolver = async (_, { id }) => {
  const flights = await db
    .knMain('flights')
    .select('*')
    .where({ flight_id: id });
  return flights;
};

exports.clientsResolver = async (_, { id }) => {
  const clients = await db
    .knMain('clients')
    .select('*')
    .where({ client_id: id });
  return clients;
};

exports.clientFlightsResolver = async client => {
  const flights = await db
    .knMain('flights')
    .select('*')
    .join('tickets', 'tickets.flight_id', 'flights.flight_id')
    .join('clients', 'clients.client_id', 'tickets.ordered_by')
    .where({ 'clients.client_id': client.client_id })
    .limit(10);
  return flights;
};

exports.ticketMutation = async (_, args) => {
  const q = await db.knMain('tickets')
    .insert({
      class: args.class,
      flight_id: args.flightId,
      from_airp: args.from_airp,
      to_airp: args.to_airp,
      time: args.time,
      price: args.price,
      ordered_by: args.ordered_by,
      booked: args.booked
    });
  return q.length > 0;
};

exports.ticketDeletion = async (_, args) => {
  const q = await db.knMain('tickets')
    .where({ id_ticket: args.ticket_id })
    .del();
  return q.length > 0;
};
