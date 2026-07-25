import axios, { AxiosError } from 'axios';
import axiosRetry, { type IAxiosRetryConfig } from 'axios-retry';
import logger from '../utils/logger.js';
import { env, config } from '../config/index.js';

const client = axios.create();

let globalShouldRetry = true;

const retryConfig: IAxiosRetryConfig = {
    retries: 3,
    retryDelay: (retryCount) => {
        // Fórmula: 2000ms * (2 ^ (retryCount - 1)) -> Tentativa 1 = 2s, Tentativa 2 = 4s, Tentativa 3 = 8s
        const delayMs = 2000 * Math.pow(2, retryCount - 1);
        return delayMs;
    },
    retryCondition: (error: AxiosError) => {
        // Pega status HTTP (ex: 500, 502, 503, 429) ou erros sem resposta (queda de rede/timeout)
        const status = error.response?.status;
        const isServerError = status ? status >= 500 && status <= 599 : false;
        const isRateLimit = status === 429;
        const isNetworkError = !error.response; // Sem resposta do servidor
        const shouldRetry = isServerError || isRateLimit || isNetworkError;

        globalShouldRetry = shouldRetry;

        return shouldRetry;
    }
};

axiosRetry(client, retryConfig);

const sendMessage = async (message: string) => {
    if (!config.integrations.enableDiscord || !globalShouldRetry) {
        return;
    }

    if (!env.DISCORD_WEB_HOOK) {
        logger.error('Integração com discord está ativado porém não foi encontrado webhook nas váriaveis de ambiente');
        globalShouldRetry = false;
        return;
    }
    
    try {
        await client.post(env.DISCORD_WEB_HOOK, {
            'content': message
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const message = error.message || 'N/A';
            logger.warn(`Falha ao enviar mensagem para o Discord [message: ${message}]`, { 
                detail: error.message
            });
        }
    }
};

export {sendMessage};