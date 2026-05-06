type ServerStatus = "OFFLINE" | "STARTING" | "ONLINE" | "STOPPING";

type Player = {
    name: string,
    raw: unknown
}

interface Server{
    id: number;
    name: string;
    path: string;
    port: number;
    status: ServerStatus;
    players: Player[];
}

export type { Server, ServerStatus, Player }