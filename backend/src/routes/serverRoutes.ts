import { Router, type Request } from 'express';
import {checkAllServerStatus, checkServerStatus, startServer, stopServer, } from '../services/serverServices.js';
import { ipGuard, tokenGuard } from '../middlewares/securityGuard.js';
import { auditLog } from '../middlewares/auditLog.js';
import config from '../../config.json' with { type: 'json' };

interface RequestBody {
    serverId: number;
}

const router = Router();

if (config.security.enableIpWhitelist) {
    router.use(ipGuard);
}

if (config.security.requireToken) {
    router.post('/start', tokenGuard);

    router.post('/stop', tokenGuard);
}

router.use(auditLog);

router.post('/start', async (req: Request<{}, {}, RequestBody>, res) => {
    if (!req.body.serverId || typeof req.body.serverId !== "number") {
        return res.status(400).json({ error: "O id do servidor deve ser um valor válido." });
    }

    const result = await startServer(req.body.serverId);
    res.json(result);
});

router.post('/stop', async (req, res) => {
    if (!req.body.serverId || typeof req.body.serverId !== "number") {
        return res.status(400).json({ error: "O id do servidor deve ser um valor válido." });
    }

    const userAuthorized = res.locals.user;

    const result = await stopServer(req.body.serverId, userAuthorized);
    res.json(result);
});

router.get('/status', async (req, res) => {
    res.json(await checkAllServerStatus());
});

router.get('/status/:id', async (req, res) => {
    const id = Number(req.params.id);

    if(!req.params.id || typeof id !== "number") {
        return res.status(400).json({ error: "O id do servidor deve ser um valor válido." });
    }

    const result = await checkServerStatus(id);
    res.json(result);
});

export default router