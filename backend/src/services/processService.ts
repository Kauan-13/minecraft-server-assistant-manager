import { spawn, execSync } from 'child_process';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const startWindowsServer = async (serverPath: string, batName: string = 'run.bat') => {
    const batPath = path.join(serverPath, batName);

    if (!await validateServerPath(batPath)) {
        throw new AppError(`Não foi possivel encontrar ou a aplicação não tem permissão de executar o 'run.bat' no caminho: ${serverPath}`, 400);
    }
    
    const child = spawn('cmd.exe', ['/c', 'run.bat'], {
        cwd: serverPath,   
    });

    child.on('error', (err) => {
        logger.error(`[SISTEMA]: Erro crítico ao disparar spawn em ${serverPath}:`, err);
    });

    child.unref();

    logger.info(`Executando servidor com .bat`);
};

const startJarServer = async (serverPath: string, javaBinary: string = 'java', jarName: string = 'server.jar', minRam: string = '1G', maxRam: string = '2G') => {
    const jarPath = path.join(serverPath, jarName);
    
    if (!isJavaInstalled(javaBinary)) {
        throw new AppError("O Java não está instalado neste computador. Não é possível iniciar o servidor .jar.", 500);
    }

    if (!await validateServerPath(jarPath)) { 
        throw new AppError(`Não foi possível encontrar o arquivo ${jarName} no caminho: ${serverPath}`, 400);
    }
    
    const args = [
        `-Xms${minRam}`,
        `-Xmx${maxRam}`,
        '-jar',
        jarName,
        'nogui'
    ];

    const child = spawn(javaBinary, args, {
        cwd: serverPath,
    });

    child.on('error', (err) => {
        logger.error(`[SISTEMA]: Erro crítico ao disparar spawn do jar em ${serverPath}:`, err);
    });

    child.unref();

    logger.info(`Executando servidor com .jar`);
};

const validateServerPath = async (serverPath: string): Promise<boolean> => {
    try {
        await access(serverPath, constants.F_OK | constants.R_OK | constants.X_OK);
        return true;
    } catch {
        return false;
    }
};

const isJavaInstalled = (javaBinary: string): boolean => {
    try {
        execSync(javaBinary + ' -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
};

export { startWindowsServer, startJarServer };