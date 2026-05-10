import type { Player } from 'gamedig';

type ServerStatus = 'OFFLINE' | 'STARTING' | 'ONLINE' | 'STOPPING';

interface Server {
    id: number;
    name: string;
    path: string;
    port: number;
    status: ServerStatus;
    players: Player[];
    stoppingTimestamp: number | null;
    inactiveTimestamp: number | null;
}

interface ServerDTO {
    id: number;
    name: string;
    bannerPath: string;
    status: ServerStatus;
    players: Player[];
}

export type { Server, ServerStatus, ServerDTO };