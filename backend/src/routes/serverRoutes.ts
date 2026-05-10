import { Router } from 'express';
import {checkAllServerStatus, checkServerStatus, getServerBanner, startServer, stopServer, } from '../services/serverServices.js';
import { ipGuard, tokenGuard } from '../middlewares/securityGuard.js';
import type { AllowedUser } from '../types/config.js';
import { config } from '../config/index.js';

const router = Router();

if (config.security.enableIpWhitelist) {
    router.use(ipGuard);
}

if (config.security.requireToken) {
    router.post('/servers/:id/start', tokenGuard);

    router.post('/servers/:id/stop', tokenGuard);
}

router.post('/servers/:id/start', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);

    if (!serverId || typeof serverId !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await startServer(serverId, res.locals.user?.name);
    res.json(result);
});

router.post('/servers/:id/stop', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);

    if (!serverId || typeof serverId !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const userAuthorized: AllowedUser = res.locals.user;

    const result = await stopServer(serverId, userAuthorized.name);
    res.json(result);
});

router.get('/servers', async (req, res) => {
    res.json(await checkAllServerStatus());
});

router.get('/servers/:id', async (req, res) => {
    const id = Number(req.params.id);

    if(!req.params.id || typeof id !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await checkServerStatus(id);
    res.json(result);
});

router.get('/servers/:id/banner', async (req, res) => {
    const id = Number(req.params.id);

    if(!req.params.id || typeof id !== 'number') {
        return res.status(400).json({ error: 'O id do servidor deve ser um valor válido.' });
    }

    const result = await getServerBanner(id);
    
    res.sendFile(result, (err) => {
        if (err) {
            res.status(404).send('Banner não disponível');
        }
    });
});

router.use((req, res, _next) => {
    res.status(404).json({
        error: 'Not Found'
    });
});

export default router;