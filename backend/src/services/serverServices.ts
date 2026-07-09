import AppError from '../utils/AppError.js';
import type { Server, ServerDTO } from '../types/server.js';
import { sendMessage } from './discordService.js';
import { serverCache } from './queryService.js';
import { startJarServer, startWindowsServer } from './processService.js';
import { sendCommand } from './rconService.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import path from 'node:path';
import type { ServerConfig } from '../types/config.js';

const startServer = async (serverId: number, userName: string) => {
    const server: Server | undefined = serverCache.get(serverId);
    const serverConfig: ServerConfig | undefined = config.servers.find(server => server.id === serverId);

    if (!server || !serverConfig) {
        logger.warn('Tentativa de start em servidor inexistente', {
            context: 'SERVER_CONTROL',
            attemptedId: serverId, 
            user: userName || 'Desconhecido',
        });
        throw new AppError('Servidor não encontrado', 404);
    }

    if (server.status == 'STARTING' || server.status == 'ONLINE' || server.status == 'STOPPING') {
        logger.warn('Tentativa de start em servidor em execução', {
            context: 'SERVER_CONTROL',
            attemptedId: serverId, 
            user: userName || 'Desconhecido',
        });
        throw new AppError('Servidor já está em execução', 409);
    }

    const activeServers = Array.from(serverCache.values())
    .filter(s => ['ONLINE', 'STARTING', 'STOPPING'].includes(s.status));

    if (activeServers.length >= config.maxConcurrentServers) {
        const serverNames = activeServers.map(s => s.name).join(', ');

        logger.warn('Limite de servidores atingido', { user: userName, active: serverNames });
        throw new AppError(`Limite atingido. Servidores ativos: ${serverNames}`, 409);
    }

    server.status = 'STARTING';
    serverCache.set(serverId, server);
    
    const startup = serverConfig.startup ?? {
        execType: 'jar',
        targetFile: 'server.jar',
        javaPath: 'java',
        minRam: '1G',
        maxRam: '2G'
    };

    try {
        const fileExtension = path.extname(startup.targetFile).toLowerCase();

        if (startup.execType === 'bat') {
            const targetFile = fileExtension === '.bat' ? startup.targetFile : 'run.bat'
            await startWindowsServer(server.path, targetFile);
        } else {
            const targetFile = fileExtension === '.jar' ? startup.targetFile : 'server.jar'
            await startJarServer(
                server.path,
                startup.javaPath || 'java',
                targetFile,
                startup.minRam || '1G',
                startup.maxRam || '2G'
            );
        }
    } catch (error) {
        server.status = 'OFFLINE';
        serverCache.set(serverId, server);
        throw error;
    }

    logger.info('Comando START recebido', { 
        serverId: server.id, 
        serverName: server.name,
        user: userName || 'Desconhecido'
    });

    sendMessage(`${userName} iniciou o ${server.name}`);
    
    return { message: `Comando enviado para o ${server.name}!` };
};

const stopServer = async (serverId: number, userName: string) => {
    const server = serverCache.get(serverId);

    if (!server) {
        logger.warn('Tentativa de stop em servidor inexistente', {
            context: 'SERVER_CONTROL',
            attemptedId: serverId, 
            user: userName || 'Desconhecido',
        });
        throw new AppError('Servidor não encontrado', 404);
    }
    
    if (server.status == 'STOPPING' || server.status == 'OFFLINE') {
        logger.warn('Tentativa de stop em servidor já offline', {
            context: 'SERVER_CONTROL',
            attemptedId: serverId, 
            user: userName || 'Desconhecido',
        });
        throw new AppError(`${server.name} já está offline`, 409);
    }

    if (server.players.length > 0) {
        const playerNames = server.players
            .map(p => p.name)
            .join(', ');

        try {
            const message = `: O usuário ${userName} tentou encerrar o servidor`;

            await sendCommand(config.servers.find(s => s.id == serverId)!.rconPort, `say ${message}`);
        } catch (err) {
            logger.warn(`Erro ao conectar no RCON. O servidor talvez já esteja offline. ${err}`, {
                context: 'SERVER_CONTROL',
                attemptedId: serverId, 
                user: userName || 'Desconhecido',
            });
            throw new AppError(`Erro ao conectar no RCON. O servidor talvez já esteja offline. ${err}`, 400);
        }

        throw new AppError(`O ${server.name} não pode ser fechado pois os jogadores: ${playerNames} está online`, 409);
    }

    try {
        await sendCommand(config.servers.find(s => s.id == serverId)!.rconPort, 'stop');

        server.status = 'STOPPING';
        server.stoppingTimestamp = Date.now();
        serverCache.set(serverId, server);

        logger.info('Comando STOP recebido', { 
            serverId: server.id, 
            serverName: server.name,
            user: userName || 'Desconhecido'
        });

        sendMessage(`${userName} encerrou o ${server.name}`);

    } catch (err) {
        logger.warn(`Erro ao conectar no RCON. O servidor talvez já esteja offline. ${err}`, {
            context: 'SERVER_CONTROL',
            attemptedId: serverId, 
            user: userName || 'Desconhecido',
        });
        throw new AppError(`Erro ao conectar no RCON. O servidor talvez já esteja offline. ${err}`, 400);
    }

    return { message: `Comando enviado para o ${server.name}!` };
};

const checkServerStatus = async (serverId: number) => {
    const server = serverCache.get(serverId);
    
    if (!server) {
        throw new AppError('Servidor não encontrado', 404);
    }

    return toServerDTO(server);
};

const checkAllServerStatus = async () => {
    return Array.from(serverCache.values()).map((server) => (toServerDTO(server)));
};

const getServerBanner = async (serverId: number) => {
    const server = serverCache.get(serverId);

    if (!server) {
        throw new AppError('Servidor não encontrado', 404);
    }

    return path.join(server.path, 'banner.jpg');
};

const toServerDTO = (server: Server): ServerDTO => ({
    id: server.id,
    name: server.name,
    bannerPath: `/servers/${server.id}/banner`,
    status: server.status,
    players: server.players,
});

export { startServer, checkServerStatus, checkAllServerStatus, stopServer, getServerBanner };