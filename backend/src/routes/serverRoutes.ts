import { Router } from 'express';
import {checkAllServerStatus, checkServerStatus, getServerBanner, startServer, stopServer, } from '../services/serverServices.js';
import { ipGuard, tokenGuard } from '../middlewares/securityGuard.js';
import type { AllowedUser } from '../types/config.js';
import { config } from '../config/index.js';

const serverRouter = Router();

if (config.security.enableIpWhitelist) {
    serverRouter.use(ipGuard);
}

if (config.security.requireToken) {
    serverRouter.post('/:id/start', tokenGuard);

    serverRouter.post('/:id/stop', tokenGuard);
}

serverRouter.post('/:id/start', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);

    if (!serverId || typeof serverId !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await startServer(serverId, res.locals.user?.name);
    res.json(result);
});

serverRouter.post('/:id/stop', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);

    if (!serverId || typeof serverId !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const userAuthorized: AllowedUser = res.locals.user;

    const result = await stopServer(serverId, userAuthorized.name);
    res.json(result);
});

serverRouter.get('/', async (req, res) => {
    res.json(await checkAllServerStatus());
});

serverRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if(!req.params.id || typeof id !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await checkServerStatus(id);
    res.json(result);
});

serverRouter.get('/:id/banner', async (req, res) => {
    const id = Number(req.params.id);

    if(!req.params.id || typeof id !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await getServerBanner(id);
    
    if (result != null) {
        return res.sendFile(result);
    }

    return res.sendStatus(404);
});

serverRouter.use((req, res, _next) => {
    res.status(404).json({
        error: 'Not Found'
    });
});

export default serverRouter;