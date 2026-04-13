import { spawn } from 'child_process';
import { GameDig } from 'gamedig';
import config from '../../config.json' with { type: 'json' };
import AppError from '../utils/AppError.js';
import type { Server, ServerStatus, User } from '../types/types.js'
import { Rcon } from 'rcon-client';
import 'dotenv/config';
const rconPassword = process.env.RCON_PASSWORD || "";

const serverCache = new Map<number, Server>();

setInterval(async () => {
    for (const server of config.servers) {
        const cached = serverCache.get(server.id);

        if (cached?.stoppingTimestamp && Math.abs(cached.stoppingTimestamp - Date.now()) < 60000) {
            continue;
        }

        try {
            const state = await GameDig.query({
                type: 'minecraft',
                host: '127.0.0.1',
                port: server.port,
                socketTimeout: 200,
                attemptTimeout: 500,
                maxRetries: 1
            });
            serverCache.set(server.id, {
                id: server.id, 
                name: server.name,
                port: server.port,
                path: server.path,
                status: "ONLINE", 
                players: state.players,
                stoppingTimestamp: null
            });
        } catch (e) {
            let newStatus: ServerStatus = cached?.status == "STARTING" ? "STARTING" : "OFFLINE";

            serverCache.set(server.id, {
                id: server.id, 
                name: server.name,
                port: server.port,
                path: server.path,
                status: newStatus,
                players: [],
                stoppingTimestamp: null 
            });
        }
    }
}, 5000);

const startServer = async (serverId: number) => {
    const server: Server | undefined = serverCache.get(serverId);

    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }

    if (server.status == "STARTING" || server.status == "ONLINE") {
        throw new AppError("Servidor já está em execução", 409)
    }

    const serverRunning = Array.from(serverCache.values()).filter(s => s.status == "ONLINE" || s.status == "STARTING" || s.status == "STOPPING");

    if (serverRunning.length == config.maxConcurrentServers) {
        const serverNames = serverRunning.map(s => s.name)
            .join(", ");

        throw new AppError(`Não é possível iniciar este servidor pois o servidor ${serverNames} já está em execução`, 409);
    }

    spawn('cmd.exe', ['/c', 'run.bat'], {
        cwd: server.path,
    });

    server.status = "STARTING";

    serverCache.set(serverId, server);
    
    return { message: `Comando enviado para o ${server.name}!` };
}

const stopServer = async (serverId: number, user: User) => {
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
            const rcon = await Rcon.connect({
                host: "127.0.0.1",
                port: config.servers.find(s => s.id == serverId)!.rconPort,
                password: rconPassword,
            });

            const message = `: O usuário ${user.name} tentou encerrar o servidor`;

            await rcon.send(`say ${message}`);
            await rcon.end();
        } catch (err) {
            console.error("[SISTEMA]: Erro ao conectar no RCON. O servidor talvez já esteja offline.", err);
        }

        throw new AppError(`O ${server.name} não pode ser fechado pois os jogadores: ${playerNames} está online`, 409);
    }

    try {
        const rcon = await Rcon.connect({
            host: "127.0.0.1",
            port: config.servers.find(s => s.id == serverId)!.rconPort,
            password: rconPassword,
        });

        rcon.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                console.log('[SISTEMA]: Conexão resetada (provavelmente o servidor fechou).');
            }
        });

        const timestamp = new Date().toLocaleTimeString('pt-BR');

        console.log(`[${timestamp}] [SISTEMA]: Conectado ao RCON. Enviando stop...`);
        const response = await rcon.send("stop");
        console.log(`[${timestamp}] [SISTEMA]: Resposta do servidor:`, response);

        server.status = "STOPPING";
        server.stoppingTimestamp = Date.now();
        serverCache.set(serverId, server);

        await rcon.send("stop");
    } catch (err) {
        console.error("[SISTEMA]: Erro ao conectar no RCON. O servidor talvez já esteja offline.", err);
    }
    
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