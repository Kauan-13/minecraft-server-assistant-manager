import express from 'express';
import serverRoutes from './routes/serverRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import cors from 'cors';
import { sendMessage } from './services/discordService.js';
import { auditLog } from './middlewares/auditLog.js';
import logger from './utils/logger.js';
import { config, env } from './config/index.js';
import playerRoutes from './routes/playerRoutes.js';

process.on('uncaughtException', (err) => {
    logger.error('Houve um erro não tratado:', err);
});

const corsOptions = {
    origin: config.security.corsURLs,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-token'],
    optionsSuccessStatus: 200 
};

const app = express();
const port = env.PORT || 3000;

app.use(express.json());

app.use(cors(corsOptions));

app.use(auditLog);

app.use('/servers', serverRoutes);
app.use('/players', playerRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`Servidor rodando em http://0.0.0.0:${port}`);

    if (!config.security.enableIpWhitelist) {
        logger.warn('Verificação de IP está DESATIVADA!');
    }
    if (!config.security.requireToken) {
        logger.warn('Verificação de TOKEN está DESATIVADA!');
    }

    if (config.security.requireToken && !env.API_TOKEN) {
        logger.error('ERRO CRÍTICO: \'requireToken\' está ativo, mas API_TOKEN não foi definido no .env');
        gracefulShutdown();
    }

    const serverList = config.servers
        .map(s => `🔹 **${s.name}**: \`${env.RADMIN_IP}:${s.port}\``)
        .join('\n');

    sendMessage(`🛰️ **Sistema Iniciado!**\n\n**Acesse o Painel:**\n${env.FRONTEND_URL}\n\n**Servidores Disponíveis:**\n${serverList}`);
});

const gracefulShutdown = async () => {
    logger.info('Finalizando processos...');

    await sendMessage('⚠️ O sistema foi desligado.');
   
    process.exit(0);
};

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (text: string) => {
    if (text.trim().toLowerCase() === 'exit' || text.trim().toLowerCase() === 'stop') {
        gracefulShutdown();
    }
});