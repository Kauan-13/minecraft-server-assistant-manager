type ServerStatus = 'OFFLINE' | 'STARTING' | 'ONLINE' | 'STOPPING' | 'SAVING';

interface Player {
    name: string,
    avatar: string
}

interface Server {
    id: number;
    name: string;
    path: string;
    port: number;
    status: ServerStatus;
    players: Player[];
    inactiveTimestamp: number | null;
}

interface ServerDTO {
    id: number;
    name: string;
    bannerPath: string;
    status: ServerStatus;
    players: Player[];
}

export type { Server, ServerStatus, ServerDTO, Player };