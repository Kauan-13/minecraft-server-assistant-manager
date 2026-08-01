import { GameDig } from 'gamedig';
import type { Player, Server, ServerStatus } from '../types/server.js';
import { stopServer } from './serverServices.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import { setTimeout } from 'node:timers/promises';

const serverCache = new Map<number, Server>();

const startServerMonitor = async () => {
    while(true) {
        for (const server of config.servers) {
            const cached = serverCache.get(server.id);
            let newServerStatus: Server = {
                    id: server.id, 
                    name: server.name,
                    port: server.port,
                    path: server.path,
                    status: 'OFFLINE', 
                    players: [],
                    inactiveTimestamp: null
            };

            if (cached) {
                newServerStatus = { ...cached };
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

                //Se não tiver players no servidor
                if (state.players.length < 1) {
                    //E não existia ainda o tempo de inatividade ele cria o timestamp
                    if (!currentInactiveTimestamp) {
                        currentInactiveTimestamp = Date.now();
                        logger.info('Server será encerrado após 30 minutos de inatividade', { 
                            server: newServerStatus.name, 
                        });
                    } else { //Se já tinha um timestamp ele verifica se já passou 30 minutos de inatividade
                        const inactiveDuration = Date.now() - currentInactiveTimestamp;

                        if (inactiveDuration >= 1800000) {
                            logger.warn('Encerramento automático disparado por inatividade', { 
                                server: newServerStatus.name, 
                            });
                            stopServer(newServerStatus.id, 'SISTEMA'); //Se tiver passado ele desliga o servidor
                            continue;
                        }
                    }
                } else { //Se tiver players ele deixa null o timestamp
                    currentInactiveTimestamp = null;
                }

                const players: Player[] = state.players.map((player) => ({
                    name: player.name!,
                    avatar: `/players/${player.name}/avatar`
                }));

                newServerStatus.status = 'ONLINE';
                newServerStatus.players = players;
                newServerStatus.inactiveTimestamp = currentInactiveTimestamp;

                serverCache.set(server.id, newServerStatus);
            } catch {
                const current = serverCache.get(server.id);

                if (
                    current?.status === 'STARTING' ||
                    current?.status === 'STOPPING' ||
                    current?.status === 'SAVING'
                ) {
                    continue;
                }

                newServerStatus.status = 'OFFLINE';
                newServerStatus.players = [];
                newServerStatus.inactiveTimestamp = null;

                serverCache.set(server.id, newServerStatus);
            }
        }

        await setTimeout(5000);
    }
}

startServerMonitor();

export { serverCache };