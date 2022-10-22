import express, { Express } from 'express';
import container from './ioc/Container';
import { IoCTypes } from './ioc/IoCTypes';
import PromClient from './PromClient';

export default class HttpServer
{
    private app: Express;

    constructor() {
        this.app = express();

        /* Add application routes to the express server */
        this.routes();

        /* Initialize the HTTP server */
        this.app.listen(parseInt(process.env.HTTP_PORT as string), '0.0.0.0', () => {
            console.log(`[${(new Date()).toISOString()}][http] API started!`);
        });
    }

    private routes(): void
    {
        /* Report Prometheus metrics on / */
        this.app.get('/metrics', async (req, res, next) => {
            const registry = container.get<PromClient>(IoCTypes.PromClient).registry;

            res.set('Content-Type', registry.contentType);
            res.end(await registry.metrics());
        
            console.log(`[${(new Date()).toISOString()}][http] Served metrics!`);
        
            next();
        });
    }
}
