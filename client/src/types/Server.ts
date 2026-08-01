type ApiError = null | {
    message: string,
    status: number,
    serverName: string,
}

type ServerStatus = "OFFLINE" | "STARTING" | "ONLINE" | "STOPPING" | "SAVING";

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

export type { ApiError, Server, ServerStatus, Player }