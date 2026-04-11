import type { Player } from "gamedig";

interface Server {
    id: number;
    name: string;
    path: string;
    port: number;
}

interface ServerCache {
    id: number;
    name: string;
    online: boolean, 
    players: Player[]
}

export type { Server, ServerCache }