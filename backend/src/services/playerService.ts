import axios from 'axios';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

const getPlayerAvatar = async (name: string) => {
    const UUID = await getPlayerUUID(name);

    try {
        return await axios.get(`https://minotar.net/helm/${UUID}`, {
            responseType: 'arraybuffer'
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const message = error.message || 'N/A';
            logger.warn('Falha ao consultar avatar', { 
                detail: error.message 
            });
            throw new AppError(`Erro ao encontrar avatar: ${message}`, 404);
        }
    }
};

const getPlayerUUID = async (name: string) => {
    try {
        const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`);
        return response.data.id;
    } catch (error: unknown) {
        if (error instanceof Error) {
            const message = error.message || 'N/A';
            logger.warn('Falha ao consultar usuário', { 
                detail: error.message 
            });
            throw new AppError(`Erro ao encontrar usuário: ${message}`, 404);
        }
    }
};

export { getPlayerAvatar };