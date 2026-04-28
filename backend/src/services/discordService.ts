import axios from 'axios';
import logger from '../utils/Logger.js';

const sendMessage = async (message: string) => {
    try {
        await axios.post(process.env.URL_DISCORD_WEB_HOOK!, {
            "content": message
        })
    } catch (error: any) {
        logger.warn("Erro na API Externa:", error.message);
    }
}

export {sendMessage}