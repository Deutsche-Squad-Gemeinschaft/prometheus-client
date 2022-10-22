import { query } from "gamedig";
import container from "./ioc/Container";
import { IoCTypes } from "./ioc/IoCTypes";
import PromClient from "./PromClient";

export default class A2SProbe
{
    layerList?: Array<string>;
    interval?: NodeJS.Timeout;

    constructor() {
        /* Load list of layers */
        this.fetchLayerList().then(layerList => {
            this.layerList = layerList;

            /* Start probing the servers A2S info endpoint */
            this.interval = setInterval(this.probe, 1000 * 15);
        })
    }

    probe = async () => {
        const result = await query({
            type: 'squad',
            host: `${process.env.SQUAD_QUERY_HOST}:${process.env.SQUAD_QUERY_PORT}`
        });
        
        /* Add player count statistic */
        container.get<PromClient>(IoCTypes.PromClient).gaugePlayers.set({type: 'Players'}, result.players.length);

        /* Add layer statistic */
        container.get<PromClient>(IoCTypes.PromClient).gaugeMaps.set({type: 'Layer'}, this.layerList?.indexOf(result.map) ?? -1);
      
        console.log(`[${(new Date()).toISOString()}][a2s] Successfully queried server!`);
    }

    async fetchLayerList() {
        /* Load static layer list from repository, each layer has its fixed order */
        const response = await fetch('https://raw.githubusercontent.com/Deutsche-Squad-Gemeinschaft/gists/master/data/LoadedLayersList.cfg');

        /* Get each line as a layer, omit empty */
        const result = (await response.text()).split('\n').filter(layer => layer.length);

        console.log(`[${(new Date()).toISOString()}][a2s] Successfully loaded layer list!`);

        return result;
    }
}
