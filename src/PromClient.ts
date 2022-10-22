import {Registry, Gauge} from 'prom-client';

export default class PromClient
{
    readonly registry: Registry;

    readonly gaugeTPS: Gauge;
    readonly gaugePlayers: Gauge;
    readonly gaugeMaps: Gauge;

    constructor() {
        this.registry = new Registry();

        this.gaugeTPS = new Gauge({
            name: 'squad_server',
            help: 'TPS statistics for the Squad Server',
            registers: [this.registry],
            labelNames: ['type'],
        });

        this.gaugePlayers = new Gauge({
            name: 'squad_server',
            help: 'Players statistics for the Squad Server',
            registers: [this.registry],
            labelNames: ['type'],
        });
          
        this.gaugeMaps = new Gauge({
            name: 'squad_server',
            help: 'Players statistics for the Squad Server',
            registers: [this.registry],
            labelNames: ['type'],
        });
    }
}