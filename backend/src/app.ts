import express from 'express';
import serverRoutes from './routes/serverRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import 'dotenv/config';
import config from '../config.json' with { type: 'json' };
import cors from 'cors';
import { sendMessage } from './services/discordServices.js';

process.on('uncaughtException', (err) => {
    console.error('Houve um erro não tratado:', err);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
    origin: config.security.corsURLs,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-token'],
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions))

app.use('/', serverRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);

    if (!config.security.enableIpWhitelist) {
        console.warn("\x1b[33m%s\x1b[0m", "[AVISO] Verificação de IP está DESATIVADA!");
    }
    if (!config.security.requireToken) {
        console.warn("\x1b[33m%s\x1b[0m", "[AVISO] Verificação de TOKEN está DESATIVADA!");
    }

    const serverList = config.servers
        .map(s => `🔹 **${s.name}**: \`${config.network.radminIp}:${s.port}\``)
        .join('\n');

    sendMessage(`🛰️ **Sistema Iniciado!**\n\n**Acesse o Painel:**\n${config.network.frontendUrl}\n\n**Servidores Disponíveis:**\n${serverList}`);
});

const gracefulShutdown = async () => {
    console.log('\nFinalizando processos...');

    try {
        await sendMessage("⚠️ O sistema foi desligado.");
    } catch (err: any) {
        console.error("Erro ao notificar:", err.message);
    } finally {
        process.exit(0);
    }
    
};

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (text: string) => {
    if (text.trim().toLowerCase() === 'exit' || text.trim().toLowerCase() === 'stop') {
        gracefulShutdown();
    }
});