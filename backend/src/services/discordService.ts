import axios from 'axios';
import logger from '../utils/logger.js';
import { env, config } from '../config/index.js';

const sendMessage = async (message: string) => {
    if (!config.integrations.enableDiscord) {
        return;
    }
    
    if (!env.DISCORD_WEB_HOOK) {
        logger.error("Integração com discord está ativado porém não foi encontrado webhook nas váriaveis de ambiente");
        return;
    }
    
    try {
        await axios.post(env.DISCORD_WEB_HOOK, {
            "content": message
        })
    } catch (error: any) {
        const status = error.response?.status || "N/A";
        logger.warn(`Falha ao enviar mensagem para o Discord [Status: ${status}]`, { 
            detail: error.message 
        });
    }
}

export {sendMessage}