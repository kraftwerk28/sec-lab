const gql = require('graphql');

const resolvers = require('./resolvers');
const types = require('./types');

const mainSchema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'Tickets',
    fields: {
      flights: {
        type: gql.GraphQLList(types.FlightType),
        args: {
          id: { type: gql.GraphQLID }
        },
        resolve: resolvers.flightsResolver
      },

      tickets: {
        type: gql.GraphQLList(types.TicketType),
        args: {
          id: { type: gql.GraphQLID },
          from: { type: gql.GraphQLString },
          to: { type: gql.GraphQLString },
          time: { type: gql.GraphQLString },
          maxPrice: { type: gql.GraphQLString }
        },
        resolve: resolvers.ticketResolver
      },

      clients: {
        type: gql.GraphQLList(types.ClientType),
        args: {
          id: { type: gql.GraphQLID }
        },
        resolve: resolvers.clientsResolver
      },

      addTicket: {
        type: gql.GraphQLBoolean,
        args: {
          class: { type: gql.GraphQLString },
          from_airp: { type: gql.GraphQLID },
          to_airp: { type: gql.GraphQLID },
          time: { type: gql.GraphQLString },
          price: { type: gql.GraphQLID },
          ordered_by: { type: gql.GraphQLID },
          flightId: { type: gql.GraphQLID },
          booked: { type: gql.GraphQLBoolean, defaultValue: false }
        },
        resolve: resolvers.ticketMutation
      },

      deleteTicket: {
        type: gql.GraphQLBoolean,
        args: {
          ticket_id: { type: gql.GraphQLID }
        },
        resolve: resolvers.ticketDeletion
      }
    }
  })
});

module.exports = {
  mainSchema
};
