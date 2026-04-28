import config from '../../config.json' with { type: 'json' };
import AppError from '../utils/AppError.js';
import type { Server } from '../types/types.js'
import 'dotenv/config';
import { sendMessage } from './discordService.js';
import { serverCache } from './queryService.js';
import { startWindowsServer } from './processService.js';
import { sendCommand } from './rconService.js';

const startServer = async (serverId: number) => {
    const server: Server | undefined = serverCache.get(serverId);

    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }

    if (server.status == "STARTING" || server.status == "ONLINE" || server.status == "STOPPING") {
        throw new AppError("Servidor já está em execução", 409)
    }

    const serverRunning = Array.from(serverCache.values()).filter(s => s.status == "ONLINE" || s.status == "STARTING" || s.status == "STOPPING");

    if (serverRunning.length == config.maxConcurrentServers) {
        const serverNames = serverRunning.map(s => s.name)
            .join(", ");

        throw new AppError(`Não é possível iniciar este servidor pois o servidor ${serverNames} já está em execução`, 409);
    }

    await startWindowsServer(server.path);

    server.status = "STARTING";

    serverCache.set(serverId, server);

    sendMessage(`${server.name} foi iniciado`);
    
    return { message: `Comando enviado para o ${server.name}!` };
}

const stopServer = async (serverId: number, userName: string) => {
    const server = serverCache.get(serverId);

    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }
    
    if (server.status == "STOPPING" || server.status == "OFFLINE") {
        throw new AppError("Servidor já está offline", 409)
    }

    if (server.players.length > 0) {
        const playerNames = server.players
            .map(p => p.name)
            .join(", ");

        try {
            const message = `: O usuário ${userName} tentou encerrar o servidor`;

            await sendCommand(config.servers.find(s => s.id == serverId)!.rconPort, `say ${message}`);
        } catch (err) {
            console.error("[SISTEMA]: Erro ao conectar no RCON. O servidor talvez já esteja offline.", err);
        }

        throw new AppError(`O ${server.name} não pode ser fechado pois os jogadores: ${playerNames} está online`, 409);
    }

    try {
        await sendCommand(config.servers.find(s => s.id == serverId)!.rconPort, "stop");

        server.status = "STOPPING";
        server.stoppingTimestamp = Date.now();
        serverCache.set(serverId, server);

    } catch (err) {
        console.error("[SISTEMA]: Erro ao conectar no RCON. O servidor talvez já esteja offline.", err);
    }
    
    sendMessage(`${server.name} foi encerrado`)

    return { message: `Comando enviado para o ${server.name}!` };
}

const checkServerStatus = async (serverId: number) => {
    const server = config.servers.find(s => s.id == serverId);
    
    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }

    return serverCache.get(serverId);
}

const checkAllServerStatus = async () => {
    return Array.from(serverCache.values());
}

export { startServer, checkServerStatus, checkAllServerStatus, stopServer };