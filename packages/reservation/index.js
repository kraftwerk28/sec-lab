'use strict';

require('../shared/env');
const app = require('fastify')();
const { addReserv, getReserv } = require('./db');

const {
  RESERVATION_PORT
} = process.env;
const PORT = RESERVATION_PORT || 8003;

app.post('/reserve', async (req, res) => {
  const { clientId, ticketId, service } = req.body;
  const time = new Date();
  addReserv(clientId, ticketId, time, service)
    .then(() => res.code(200).send('ok'))
    .catch((err) => res.code(500).send(err));
});

app.get('/reservations', (req, res) => {
  getReserv()
    .then(data => res.code(200).send(data.rows))
    .catch((err) => res.code(500).send(err));
});

app
  .listen({ host: '0.0.0.0', port: PORT })
  .then(() => console.log(`Reservation server working on port :${PORT}`))

;['SIGTERM', 'SIGINT'].forEach(s => {
  process.on(s, () => {
    app.close(() => {
      process.exit(0);
    });
  });
});
