import { ChildProcess, spawn } from 'child_process';
import { GameDig } from 'gamedig';
import config from '../../config.json' with { type: 'json' };
import AppError from '../utils/AppError.js';
import type { Server, ServerCache } from '../types/types.js'

const serverCache = new Map<number, ServerCache>();
const serverProcess = new Map<number, ChildProcess>();

setInterval(async () => {
    for (const server of config.servers) {
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
                online: true, 
                players: state.players
            });
        } catch (e) {
            serverCache.set(server.id, {
                id: server.id, 
                name: server.name, 
                online: false, 
                players: [] 
            });
        }
    }
}, 5000);

const startServer = async (serverId: number) => {
    const server: Server | undefined = config.servers.find(s => s.id == serverId);

    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }

    if (serverCache.get(serverId)?.online == true) {
        throw new AppError("Servidor já está online", 409)
    }

    const serverRunning = Array.from(serverCache.values()).find(s => s.online === true);

    if (serverRunning) {
        throw new AppError(`Não é possível iniciar este servidor pois o servidor ${serverRunning.name} já está em execução`, 409);
    }

    const childProcess = spawn('cmd.exe', ['/c', 'run.bat'], {
        cwd: server.path,
        shell: true,
        stdio: 'pipe'
    });

    childProcess.stdout.on('data', (data) => {
        const log = data.toString();
        console.log(`[LOG ${server.name}]: ${log}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`[ERRO ${server.name}]: ${data.toString()}`);
    });

    childProcess.on('exit', () => {
        serverProcess.delete(serverId);
        console.log(`[SISTEMA]: Processo do servidor ${serverId} removido do cache.`);
    });

    serverProcess.set(serverId, childProcess)
    
    return { message: `Comando enviado para o ${server.name}!` };
}

const stopServer = async (serverId: number) => {
    const childProcess = serverProcess.get(serverId);
    const server = serverCache.get(serverId);

    if (!server) {
        throw new AppError("Servidor não encontrado", 404);
    }
    
    if (server.online == false) {
        throw new AppError("Servidor já está offline", 409)
    }

    if (server.players.length > 0) {
        const playerNames = server.players
            .map(p => p.name)
            .join(", ");


        throw new AppError(`O ${server.name} não pode ser fechado pois os jogadores: ${playerNames} está online`, 409);
    }

    if (childProcess) {
        childProcess.stdin?.write('stop\n');
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
    return Object.fromEntries(serverCache);
}

export { startServer, checkServerStatus, checkAllServerStatus, stopServer };