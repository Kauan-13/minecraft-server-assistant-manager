import { spawn } from "child_process";
import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import AppError from "../utils/AppError.js";

const startWindowsServer = async (serverPath: string) => {
    if (!await validateServerPath(serverPath)) {
        throw new AppError(`Não foi possivel encontrar ou a aplicação não tem permissão de executar o 'run.bat' no caminho: ${serverPath}`, 400)
    }
    
    const child = spawn('cmd.exe', ['/c', 'run.bat'], {
        cwd: serverPath,   
    });

    child.on('error', (err) => {
        console.error(`[SISTEMA]: Erro crítico ao disparar spawn em ${serverPath}:`, err);
    });

    child.unref();
}

const validateServerPath = async (serverPath: string): Promise<boolean> => {
    const batPath = path.join(serverPath, 'run.bat');
    
    try {
        await access(batPath, constants.F_OK | constants.R_OK | constants.X_OK);
        return true;
    } catch {
        return false;
    }
};

export { startWindowsServer }