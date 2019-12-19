require('../../shared/env');
const fastify = require('fastify');
const fastifyGQL = require('fastify-gql');

const { disconnect } = require('./db');
const { mainSchema } = require('./schemas');

const { GRAPHQL_PORT } = process.env;
const PORT = GRAPHQL_PORT || 8004;

const app = fastify();
app.register(fastifyGQL, {
  graphiql: true,
  schema: mainSchema
});
app.get('/', (req, res) => res.send({ ok: true }));

app.listen(PORT, () => console.log('GraphQL server running on :' + PORT));

['SIGINT', 'SIGTERM'].forEach(s => {
  process.on(s, async () => {
    await app.close();
    await disconnect();
    console.log('Gracefully shutted down');
  });
});
