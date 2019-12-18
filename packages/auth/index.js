'use strict';

require('../shared/env');
const http = require('http');
const qs = require('querystring');

const tokenStore = require('./token')();

const { AUTH_USER, AUTH_PASS, AUTH_PORT } = process.env;
const PORT = AUTH_PORT || 8002;

console.log('Auth data:', {
  AUTH_USER, AUTH_PASS
});

const getBody = (req, isJSON = false) =>
  new Promise((res, rej) => {
    const data = [];
    req
      .on('data', ch => data.push(ch))
      .on('end', () => {
        const resp = Buffer.concat(data).toString();
        res(isJSON ? JSON.parse(resp) : resp);
      })
      .on('error', rej);
  });

const getQuery = req => {
  if (!req.url.includes('?')) return {};

  const str = req.url.slice(req.url.indexOf('?') + 1);
  return qs.parse(str);
};

const routes = [
  {
    method: 'POST',
    url: '/token',
    handler: async (req, res) => {
      const { user, pass } = await getBody(req, true);
      console.log({ user, pass });

      if (user === AUTH_USER && pass === AUTH_PASS) {
        const token = tokenStore.makeToken();
        res.writeHead(200).end(token);
      } else {
        res.writeHead(401).end('Unauthorized');
      }
    }
  },
  {
    method: 'GET',
    url: '/verify',
    handler: async (req, res) => {
      const query = getQuery(req);
      if (query.token && query.token === tokenStore.getToken()) {
        console.log('Token verified');
        res.writeHead(200).end('ok');
        return;
      }
      
      console.log('Wrong token');
      res.writeHead(401).end();
    }
  }
];

const httpHandler = async (req, res) => {
  console.log('%s\t%s', req.method, req.url);
  const matched = routes.find(
    r => r.method === req.method && req.url.startsWith(r.url)
  );

  if (!matched) {
    res.writeHead(400).end('No routes found');
    return;
  }

  matched.handler(req, res);
};

const server = http.createServer(httpHandler);
server.listen(PORT, () => console.log('Auth server on :' + PORT))

;['SIGTERM', 'SIGINT'].forEach(s => {
  process.on(s, () => {
    server.close(() => {
      process.exit(0);
    });
  });
});
