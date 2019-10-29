'use strict';

const http = require('http');
const url = require('url');

const { list, byID } = require(__dirname + '/db.js');

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url, true).pathname;

  if (pathname === '/price-list/' | pathname === '/price-list') {
    list().then(tickets => res.end(JSON.stringify(tickets)));
  } else if (pathname.match(/\/details\/.*/)) {
    const id = pathname.slice(9);
    byID(id).then(tickets => res.end(JSON.stringify(tickets)));
  } else {
    res.end('404');
  }

});

server.listen(8001);
