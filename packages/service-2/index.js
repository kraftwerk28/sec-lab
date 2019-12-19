'use strict';

require('../shared/env');
const http = require('http');
const url = require('url');

const { list, byID } = require('./db');

const { SERVICE2_PORT } = process.env;
const PORT = SERVICE2_PORT || 8000;
const RES_HEADERS = { 'content-type': 'application/json' };

const priceListRE = /^\/price-list(?:\/(\d+))?(?:\/*)$/;
const detailsRE = /^\/details\/([^\s/]+)(?:\/*)$/;

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url, true).pathname;

  const priceListMatch = pathname.match(priceListRE);
  const detailsMatch = pathname.match(detailsRE);

  if (priceListMatch) {
    const [, page = 0] = priceListMatch;
    list(page).then(tickets =>
      res.writeHead(200, RES_HEADERS).end(JSON.stringify(tickets))
    );
    return;
  }

  if (detailsMatch) {
    const [, id] = detailsMatch;
    byID(id).then(tickets =>
      res
        .writeHead(200, RES_HEADERS)
        .end(JSON.stringify(tickets[0] ? tickets[0] : {}))
    );
    return;
  }

  res.writeHead(400).end();
});

server.listen(PORT, () => console.log('Listening on port :' + PORT))

;['SIGTERM', 'SIGINT'].forEach(s => {
  process.on(s, () => {
    server.close(() => {
      process.exit(0);
    });
  });
});
