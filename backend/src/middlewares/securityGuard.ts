import type { Request, Response, NextFunction } from 'express';
import config from '../../config.json' with { type: 'json' };

const timestamp = new Date().toLocaleTimeString('pt-BR');

const ipGuard = (req: Request, res: Response, next: NextFunction) => {
    

    const clientIp = req.ip || req.socket.remoteAddress || '';

    const authorizedUser = config.security.allowedUsers.find(user => user.ips.includes(clientIp));

    if (authorizedUser) {
        res.locals.user = authorizedUser;
        return next();
    }

    console.warn(`[${timestamp}] [SISTEMA] [BLOQUEIO]: Tentativa de acesso negada para o IP ${clientIp}`);
    res.status(403).json({ error: "IP não autorizado." });
}

const tokenGuard = (req: Request, res: Response, next: NextFunction) => {
    const providedToken = req.headers['x-api-token'];
    const secretToken = process.env.API_TOKEN;

    if (!providedToken || providedToken !== secretToken) {
        console.warn(`[${timestamp}] [SISTEMA] [BLOQUEIO]: Tentativa de comando com token inválido.`);
        return res.status(401).json({ error: "Token de autorização inválido." });
    }

    next();
}

export {ipGuard, tokenGuard}
