import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Nível mínimo para logar
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      // Formato: [2026-04-28 15:30] [INFO]: Mensagem { "meta": "dados" }
      let msg = `[${timestamp}] [${level.toUpperCase()}]: ${message} `;
      if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
      }
      return msg;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log no terminal
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Só erros aqui
    new winston.transports.File({ filename: 'logs/combined.log' }) // Tudo aqui
  ],
});

export default logger;