import { query } from "gamedig";
import container from "./ioc/Container";
import { IoCTypes } from "./ioc/IoCTypes";
import PromClient from "./PromClient";

export default class A2SProbe
{
    interval: NodeJS.Timeout;

    constructor() {
        /* Start probing the servers A2S info endpoint */
        this.interval = setInterval(this.probe, 1000 * 15);
    }

    probe = async () => {
        const result = await query({
            type: 'squad',
            host: `${process.env.SQUAD_QUERY_HOST}:${process.env.SQUAD_QUERY_PORT}`
        });
          
        container.get<PromClient>(IoCTypes.PromClient).gaugePlayers.set({type: 'Players'}, result.players.length);
        container.get<PromClient>(IoCTypes.PromClient).gaugeMaps.set({type: 'Players'}, result.map);
      
        console.log(`[${(new Date()).toISOString()}][a2s] Successfully queried server!`);
    }
}
