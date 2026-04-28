import { GameDig } from 'gamedig';
import config from '../../config.json' with { type: 'json' };
import type { Server, ServerStatus } from '../types/types.js'
import { stopServer } from './serverServices.js';

const serverCache = new Map<number, Server>();

setInterval(async () => {
    for (const server of config.servers) {
        const cached = serverCache.get(server.id);
        let newServerStatus: Server = {
                id: server.id, 
                name: server.name,
                port: server.port,
                path: server.path,
                status: "OFFLINE", 
                players: [],
                stoppingTimestamp: null,
                inactiveTimestamp: null
        };

        if (cached) {
            newServerStatus = { ...cached };
        }

        // Mantenho o status STOPPING por 1 minuto para dar tempo de criar backup e fechar corretamente antes de alguém tentar abrir o servidor de novo
        if (newServerStatus.stoppingTimestamp && Math.abs(newServerStatus.stoppingTimestamp - Date.now()) < 60000) {
            newServerStatus.inactiveTimestamp = null;
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

            //Se não tiver players no servidor
            if (state.players.length < 1) {
                //E não existia ainda o tempo de inatividade ele cria o timestamp
                if (!currentInactiveTimestamp) {
                    currentInactiveTimestamp = Date.now();
                    const timestamp = new Date().toLocaleTimeString('pt-BR');
                    console.log(`[${timestamp}] [SISTEMA]: ${newServerStatus.name} inativo fechará em 30 minuto`);
                } else { //Se já tinha um timestamp ele verifica se já passou 30 minutos de inatividade
                    const inactiveDuration = Date.now() - currentInactiveTimestamp;

                    if (inactiveDuration >= 1800000) {
                        const timeStr = new Date().toLocaleTimeString('pt-BR');
                        console.log(`[${timeStr}] [SISTEMA]: ${newServerStatus.name} inativo há 30min. Desligando...`);
                        stopServer(newServerStatus.id, "SISTEMA"); //Se tiver passado ele desliga o servidor
                        continue;
                    }
                }
            } else { //Se tiver players ele deixa null o timestamp
                currentInactiveTimestamp = null;
            }

            newServerStatus.status = "ONLINE";
            newServerStatus.players = state.players;
            newServerStatus.stoppingTimestamp = null;
            newServerStatus.inactiveTimestamp = currentInactiveTimestamp;

            serverCache.set(server.id, newServerStatus);
        } catch (e) {
            let newStatus: ServerStatus = cached?.status == "STARTING" ? "STARTING" : "OFFLINE";

            newServerStatus.status = newStatus;
            newServerStatus.stoppingTimestamp = null;
            newServerStatus.inactiveTimestamp = null;

            serverCache.set(server.id, newServerStatus);
        }
    }
}, 5000);

export { serverCache }