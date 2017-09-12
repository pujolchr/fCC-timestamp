#! /usr/bin/env nodejs

'use strict';

const path = require('path');
const url = require('url');
const http = require('http');

if (process.argv.length !== 3) {
  process.stderr.write(`usage: ${path.basename(process.argv[1])} port\n`);
  process.exit(1);
}

const sendResponse = (r, data) => {
  r.writeHead(200, { 'content-type': 'application/json' });
  r.write(JSON.stringify(data));
  r.end();
};

const server = http.createServer((req, res) => {
  // parse the url
  const URL = url.parse(req.url, true);
  let api = URL.pathname.replace(/^\//, '');
  api = decodeURI(api);

  // get the time stamp
  let timestamp;
  if (/^\d+$/.test(api)) {
    // unix time -> seconds but javascript Date-> milliseconds
    timestamp = parseInt(api, 10) * 1000;
  } else {
    timestamp = Date.parse(api);
  }

  const payload = {};

  // check if valid time
  if (Number.isNaN(timestamp)) {
    payload.unix = null;
    payload.natural = null;
  } else {
    // build pay load
    const date = new Date(timestamp);
    payload.unix = date.getTime() / 1000;
    payload.natural = date.toLocaleString('en', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  }

  sendResponse(res, payload);
});

server.listen(process.argv[2]);
