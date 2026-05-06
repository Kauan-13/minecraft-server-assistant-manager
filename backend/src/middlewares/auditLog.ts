import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

const auditLog = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || '';
    const { method, originalUrl: path } = req;

    // Pegamos os dados (res.locals.user pode estar undefined se vier antes do token, e tudo bem)
    const user = config.security.allowedUsers.find(u => u.ips.includes(clientIp));

    res.locals.user = user;
    
    logger.info(`${method} ${path}`, { 
        user: user || 'Visitante', 
        ip: clientIp,
        context: 'AUDIT'
    });
    
    next();
};

export { auditLog };