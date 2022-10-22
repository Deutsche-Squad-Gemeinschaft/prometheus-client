import { query } from "gamedig";

setInterval(async() => {
    const result = await query({
      type: 'squad',
      host: `${process.env.SQUAD_QUERY_HOST}:${process.env.SQUAD_QUERY_PORT}`
    });
    
    gaugePlayers.set({type: 'Players'}, result.players.length);
    gaugeMaps.set({type: 'Players'}, result.map);

    console.log(`[${(new Date()).toISOString()}][a2s] Successfully queried server!`);
}, 1000 * 15);