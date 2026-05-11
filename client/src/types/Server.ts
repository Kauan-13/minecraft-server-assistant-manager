type ServerStatus = "OFFLINE" | "STARTING" | "ONLINE" | "STOPPING";

type Player = {
    name: string,
    raw: unknown,
    avatar: string,
}

type Server = {
    id: number,
    name: string,
    bannerPath: string,
    status: ServerStatus,
    players: Player[],
}

export type { Server, ServerStatus, Player }