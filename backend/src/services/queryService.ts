import { GameDig } from 'gamedig';
import config from '../../config.json' with { type: 'json' };
import type { Server, ServerStatus } from '../types/types.js'
import { stopServer } from './serverServices.js';

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

            let currentInactiveTimestamp: number | null = cached?.inactiveTimestamp || null;

            if (state.players.length < 1) {

                if (!currentInactiveTimestamp) {
                    currentInactiveTimestamp = Date.now();
                    const timestamp = new Date().toLocaleTimeString('pt-BR');
                    console.log(`[${timestamp}] [SISTEMA]: Servidor inativo fechará em 30 minuto`);
                } else {
                    const inactiveDuration = Date.now() - currentInactiveTimestamp;

                    if (inactiveDuration >= 1800000) {
                        const timeStr = new Date().toLocaleTimeString('pt-BR');
                        console.log(`[${timeStr}] [SISTEMA]: ${server.name} inativo há 30min. Desligando...`);
                        stopServer(server.id, "SISTEMA");
                        continue;
                    }
                }
            } else {
                currentInactiveTimestamp = null;
            }

            serverCache.set(server.id, {
                id: server.id, 
                name: server.name,
                port: server.port,
                path: server.path,
                status: "ONLINE", 
                players: state.players,
                stoppingTimestamp: null,
                inactiveTimestamp: currentInactiveTimestamp
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
                stoppingTimestamp: null,
                inactiveTimestamp: null
            });
        }
    }
}, 5000);

export { serverCache }