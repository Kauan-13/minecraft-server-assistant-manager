import type { Player } from "gamedig";

type ServerStatus = "OFFLINE" | "STARTING" | "ONLINE" | "STOPPING";

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

interface User {
    name: string,
    ips: string[]
}

export type { Server, ServerStatus, User }