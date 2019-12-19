const gql = require('graphql');
const resolvers = require('./resolvers');

const TicketType = new gql.GraphQLObjectType({
  name: 'Ticket',
  fields: {
    id_ticket: { type: gql.GraphQLInt },
    class: { type: gql.GraphQLString },
    ordered_by: { type: gql.GraphQLInt },
    flight_id: { type: gql.GraphQLInt },
    from_airp: { type: gql.GraphQLInt },
    to_airp: { type: gql.GraphQLInt },
    time: { type: gql.GraphQLString },
    price: { type: gql.GraphQLFloat },
    booked: { type: gql.GraphQLBoolean },
    seat: { type: gql.GraphQLString }
  }
});

const FlightType = new gql.GraphQLObjectType({
  name: 'Flight',
  fields: {
    flight_id: { type: gql.GraphQLID },
    airport_id: { type: gql.GraphQLID },
    plane_model: { type: gql.GraphQLString },
    departure_time: { type: gql.GraphQLString },
    arrival_time: { type: gql.GraphQLString },
    tickets: {
      type: gql.GraphQLList(TicketType),
      resolve: resolvers.flightTicketsResolver
    }
  }
});

const ClientType = new gql.GraphQLObjectType({
  name: 'Client',
  fields: {
    client_id: { type: gql.GraphQLID },
    first_name: { type: gql.GraphQLString },
    last_name: { type: gql.GraphQLString },
    passport_id: { type: gql.GraphQLString },
    birth_date: { type: gql.GraphQLString },
    registered_time: { type: gql.GraphQLString },
    flights: {
      type: gql.GraphQLList(FlightType),
      resolve: resolvers.clientFlightsResolver
    }
  }
});

module.exports = {
  FlightType,
  ClientType,
  TicketType
};
