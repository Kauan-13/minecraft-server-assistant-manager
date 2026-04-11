import { Router, type Request } from 'express';
import {checkAllServerStatus, checkServerStatus, startServer, stopServer, } from '../services/serverServices.js';

interface RequestBody {
    serverId: number;
}

const router = Router();

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

    const result = await stopServer(req.body.serverId);
    res.json(result);
});

router.get('/status', async (req, res) => {
    res.json(await checkAllServerStatus());
});

router.get('/status/:id', async (req, res) => {
    if(!req.params.id || typeof req.params.id !== "number") {
        return res.status(400).json({ error: "O id do servidor deve ser um valor válido." });
    }

    const result = await checkServerStatus(req.params.id);
    res.json(result);
});

export default router