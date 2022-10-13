/* Import and load dotenv first */
import 'dotenv/config';

import {Registry, Gauge} from 'prom-client';
import {Tail} from 'tail';
import express from 'express';
import { query } from 'gamedig';

const app = express();

/* Initialize the metrics */
const registry = new Registry();

/* Create and configure TPS gauge */
const gaugeTPS = new Gauge({
  name: 'squad_server',
  help: 'TPS statistics for the Squad Server',
  registers: [registry],
  labelNames: ['type'],
});

const tail = new Tail(process.env.LOG_FILE_PATH as string);
tail.on('line', (data: string) => {
  const matches = data.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: USQGameState: Server Tick Rate: ([0-9.]+)/
  );
  if (matches) {
    console.log('[TAIL] Matched line! Adding to gauge...');
    gaugeTPS.set({type: 'TPS'}, parseFloat(matches[3]));
  }
});
tail.on('error', error => {
  console.error('[TAIL] ERROR: ', error);
});

const gaugePlayers = new Gauge({
  name: 'squad_server',
  help: 'Players statistics for the Squad Server',
  registers: [registry],
  labelNames: ['type'],
});

const gaugeMaps = new Gauge({
  name: 'squad_server',
  help: 'Players statistics for the Squad Server',
  registers: [registry],
  labelNames: ['type'],
});

setInterval(async() => {
  const result = await query({
    type: 'squad',
    host: `127.0.0.1:${process.env.SQUAD_QUERY_PORT}`
  });


  console.log('[GAMEDIG] Queried server! Adding to gauges...');
  gaugePlayers.set({type: 'Players'}, result.players.length);
  gaugeMaps.set({type: 'Players'}, result.map);
}, 1000 * 15);


/* Report Prometheus metrics on / */
app.get('/metrics', async (req, res, next) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());

  console.log('[EXPRESS] Served metrics!');

  next();
});

/* Initialize the HTTP server */
app.listen(parseInt(process.env.HTTP_PORT as string), '0.0.0.0', () =>
  console.log('App started!')
);
