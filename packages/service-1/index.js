'use strict';

const http = require('http');
const url = require('url');

const select = require(__dirname + '/db.js');

const server = http.createServer((req, res) => {
  const parsedURL = url.parse(req.url, true);

  const query = parsedURL.query.query; // custom field query in url query

  if (parsedURL.pathname !== '/search' || !query) {
    res.end('404');
    return;
  }

  const parsedQuery = query
    .slice(1, -1)
    .split('|')
    .map(pair => pair
      .split('=')
    )
    .reduce((prev, curr) => (prev[curr[0]] = curr[1], prev), {});

  select(parsedQuery)
    .then(tickets => res.end(JSON.stringify(tickets)));

});

server.listen(8000);
