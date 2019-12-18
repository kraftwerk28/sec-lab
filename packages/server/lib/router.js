import { URL, URLSearchParams } from 'url';

import fetch from 'node-fetch';

import * as db from './db';
import { protocol } from './utils';
import { get } from './fetch';

const { SERVER_PORT, AUTH_PORT, LOCALHOST } = process.env;
const PORT = SERVER_PORT || 8080;
const S2_LIST_LIMIT = 120;

const dbOk = result => ({ status: 'ok', ...result });
const dbErr = error => ({ status: 'error', error: error });

const s1Search = async req => {
  const clauses = req.body;

  const s1Query = Object.keys(clauses)
    .map(key => `${key}:${clauses[key]}`)
    .join(',');

  const url = new URL(`${protocol()}://${LOCALHOST}`);
  url.port = PORT;
  url.pathname = '/s1/search';
  url.search = new URLSearchParams({ query: s1Query });

  return get(url)
    .catch(() => []);
};

const s2Search = async req => {
  const makePageRequest = async (req, array, curPage) => {
    if (array.length > S2_LIST_LIMIT) return array;
    const url = new URL('http://127.0.0.1');
    url.port = PORT;
    url.pathname = '/s2/price-list/' + curPage;
    const data = await get(url).catch(() => []);
    if (data.length) {
      return makePageRequest(req, array.concat(data), curPage + 1);
    } else {
      return array;
    }
  };

  const CLAUSE_MAP = {
    from: 'from_airp',
    to: 'to_airp',
    time: 'time',
    maxPrice: 'price'
  };
  const entities = await makePageRequest(req, [], 0);
  const clauses = req.body;

  return entities.filter(ticket =>
    // iterate over each clause in QUERY
    Object.keys(clauses).some(clause => {
      if (!CLAUSE_MAP[clause]) return false;
      // map QUERY clause to database specific FIELD
      const field = CLAUSE_MAP[clause];
      if (!ticket[field]) return false;
      return ticket[field].toString().match(new RegExp(clauses[clause], 'i'));
    })
  );
};

const mainSearch = async req => {
  const url = new URL('http://127.0.0.1');
  url.port = PORT;
  url.pathname = '/get-tickets';

  const CLAUSE_MAP = {
    from: 'from_airp',
    to: 'to_airp',
    time: 'time',
    maxPrice: 'price'
  };

  const entities = await get(url).catch(() => []);
  const clauses = req.body;
  
  return entities.data.filter(ticket => {
    Object.keys(clauses).some(clause => {
      if (!CLAUSE_MAP[clause]) return false;
      const field = CLAUSE_MAP[clause];
      if (!ticket[field]) return false;
      return ticket[field].toString().match(new RegExp(clauses[clause], 'i'));
    });
  });
};

export const index = (req, res) => {
  res.status(200).send(dbOk());
};

export const addAirport = (req, res) => {
  db.addAirport(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)));
};

export const addTicket = (req, res) => {
  db.addTicket(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)));
};

export const addClient = (req, res) => {
  db.addTicket(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)));
};

export const addFlight = (req, res) => {
  db.addFlight(req.body)
    .then(result =>
      res.status(200).send(dbOk({ rowsAffected: result.rowCount }))
    )
    .catch(err => res.status(500).send(dbErr(err)));
};

export const getTickets = (req, res) => {
  db.getTickets().then(data => res.status(200).send(dbOk({ data })));
};

export const getAirports = (req, res) => {
  db.getAirports().then(data => res.status(200).send(dbOk({ data })));
};

export const getClients = (req, res) => {
  db.getClients().then(data => res.status(200).send(dbOk({ data })));
};

export const getFlights = (req, res) => {
  db.getFlights().then(data => res.status(200).send(dbOk({ data })));
};

export const search = async (req, res) => {
  const s1Res = s1Search(req);
  const s2Res = s2Search(req);
  const mainRes = mainSearch(req);

  Promise.all([s1Res, s2Res, mainRes])
    .then(([s1, s2, main]) => {
      console.dir({
        s1: s1.length,
        s2: s2.length,
        main: main.length
      });
      const data = main.concat(s1, s2);
      res.code(200).send(dbOk({ data }));
    })
    .catch(e => {
      res.code(400).send(dbErr(e));
    });
};

export const withAuth = async (req, res, next) => {
  if (!(req.body || {}).token) {
    res.code(400).send('No token given');
  }
  const { token } = req.body;
  const reqUrl = new URL('http://127.0.0.1');
  reqUrl.port = AUTH_PORT;
  reqUrl.pathname = '/verify';
  reqUrl.searchParams.append('token', token);
  
  const authRes = await get(reqUrl, { responseType: null });
  if (authRes.status === 401) {
    res.code(401).send('Unauthorized b/c of wrong token');
  } else {
    return next();
  }
};

export const login = async (req, res) => {
  const reqUrl = new URL('http://127.0.0.1');
  reqUrl.port = AUTH_PORT;
  reqUrl.pathname = '/token';
  const { user, pass } = req.body;

  const tokenRes = await fetch(
    reqUrl,
    { method: 'POST', body: JSON.stringify({ user, pass }) }
  );

  if (tokenRes.status === 200) {
    res.code(200).send(tokenRes.body);
  } else {
    res.code(401).send('Unauthorized');
  }
};

export const authTest = async () => {
  console.log('bruh');
  return 'Some secret data...';
};
