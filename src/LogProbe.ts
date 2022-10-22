import { Tail } from "tail";
import container from "./ioc/Container";
import { IoCTypes } from "./ioc/IoCTypes";
import PromClient from "./PromClient";

export default class LogProbe
{
    private readonly tail: Tail

    constructor() {
        this.tail = new Tail(process.env.LOG_FILE_PATH as string);
    }

    applyListeners(): void
    {
        this.tail.on('line', (data: string) => {
            const matches = data.match(
                /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: USQGameState: Server Tick Rate: ([0-9.]+)/
            );
            if (matches) {
                console.log(`[${(new Date()).toISOString()}][tail] Matched line! Adding to gauge...`);
                container.get<PromClient>(IoCTypes.PromClient).gaugeTPS.set({type: 'TPS'}, parseFloat(matches[3]));
            }
        });
        
        this.tail.on('error', error => {
            console.error(`[${(new Date()).toISOString()}][tail] ERROR: `, error);
        });
    }
}