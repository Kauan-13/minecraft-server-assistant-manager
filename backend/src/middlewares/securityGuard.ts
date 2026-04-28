import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { env } from '../config/index.js';

const ipGuard = (req: Request, res: Response, next: NextFunction) => {
    // Se o auditLog achou o usuário, ele estará aqui
    if (res.locals.user) {
        return next();
    }

    const clientIp = req.ip || req.socket.remoteAddress || '';
    
    // Usando logger.warn para bloqueios
    logger.warn(`Acesso negado: IP não autorizado`, { ip: clientIp });
    
    res.status(403).json({ error: "IP não autorizado." });
}

const tokenGuard = (req: Request, res: Response, next: NextFunction) => {
    const providedToken = req.headers['x-api-token'];
    const secretToken = env.API_TOKEN;

    if (!secretToken) {
        logger.error("ERRO CRÍTICO: 'requireToken' está ativo, mas API_TOKEN não foi definido no .env");
        return res.status(403).json({error: "não foi possivel validar token"})
    }

    if (!providedToken || providedToken !== secretToken) {
        logger.warn(`Tentativa de comando com token inválido`, { 
            user: res.locals.user?.name || "Desconhecido" 
        });
        return res.status(401).json({ error: "Token de autorização inválido." });
    }

    next();
}

export {ipGuard, tokenGuard}
