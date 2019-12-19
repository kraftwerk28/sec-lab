'use strict';

require('../shared/env');
const http = require('http');
const url = require('url');

const select = require('./db');

const { SERVICE1_PORT } = process.env;
const PORT = SERVICE1_PORT || 8000;
const RESPONSE_TIMEOUT = 1000;
const runDelayed = fn => setTimeout(fn, RESPONSE_TIMEOUT);

const server = http.createServer((req, res) => {
  const parsedURL = url.parse(req.url, true);
  const { query } = parsedURL.query;
  if (parsedURL.pathname !== '/search' || !query) {
    runDelayed(() => {
      res.writeHead(400).end();
    });
    return;
  }

  // format query=key1:val1,key2:val2
  const parsedQuery = query
    .split(',')
    .map(pair => pair.trim().split(':'))
    .reduce((acc, [k, v]) => ((acc[k] = v), acc), {});

  select(parsedQuery).then(tickets =>
    runDelayed(() => {
      res
        .writeHead(200, { 'content-type': 'application/json' })
        .end(JSON.stringify(tickets));
    })
  );
});

server.listen(PORT, () => console.log(`Listening on port :${PORT}`));

const signals = ['SIGTERM', 'SIGINT'];
signals.forEach(s => {
  process.on(s, () => {
    server.close(() => {
      process.exit(0);
    });
  });
});
