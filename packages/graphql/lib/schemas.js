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
          id: { type: gql.GraphQLID, defaultValue: 1 },
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
      }
    }
  })
});

module.exports = {
  mainSchema
};
