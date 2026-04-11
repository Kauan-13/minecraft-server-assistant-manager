import express from 'express';
import serverRoutes from './routes/serverRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import 'dotenv/config';
import config from '../config.json' with { type: 'json' };

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
});