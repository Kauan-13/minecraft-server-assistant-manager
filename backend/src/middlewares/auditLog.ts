import type { Request, Response, NextFunction } from 'express';

const auditLog = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user?.name || "Desconhecido";
    const method = req.method;
    const path = req.originalUrl;
    const clientIp = req.ip || req.socket.remoteAddress || ''
    const timestamp = new Date().toLocaleTimeString('pt-BR');

    console.log(`[${timestamp}] [SISTEMA]: ${method} ${path} | Usuário: ${user} (${clientIp})`);
    
    next();
};

export {auditLog}