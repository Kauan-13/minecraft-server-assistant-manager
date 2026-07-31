import fs  from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import logger from '../utils/logger.js';

interface BackupFile {
    name: string;
    path: string;
    mtime: number;
}

const createBackup = async (serverPath: string, maxBackups: number) => {
    try {
        const backupDir = path.join(serverPath,'backups');
        const sourceDir = path.join(serverPath,'world');

        await fs.ensureDir(backupDir);

        const now = new Date();
        const pad = (num: number) => String(num).padStart(2, '0');
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        const fileName = `backup_${timestamp}.zip`;
        const outputPath = path.join(backupDir, fileName);

        const zip = new AdmZip();

        zip.addLocalFolder(sourceDir, '');

        await zip.writeZipPromise(outputPath);
        
        console.log(`Backup criado com sucesso: ${fileName}`);

        await rotateBackups(backupDir, maxBackups);
    } catch (err) {
        logger.warn('Erro ao criar backup do servidor.', {
            context: 'BACKUP',
            serverPath,
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
        });

        throw err;
    }
}

const rotateBackups = async (backupDir: string, maxBackups: number) => {
    const files = await fs.readdir(backupDir);

    const backupFiles: BackupFile[] = files
        .filter((file) => file.startsWith('backup_') && file.endsWith('.zip'))
        .map((file) => {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                path: filePath,
                mtime: stats.mtimeMs
            };
        });

    // Ordena do mais antigo ao mais recente
    backupFiles.sort((a, b) => a.mtime - b.mtime);

    // Se exceder o limite, apaga os mais antigos
    while (backupFiles.length > maxBackups) {
        const oldest = backupFiles.shift();
        if (oldest) {
            await fs.remove(oldest.path);
            console.log(`Backup antigo removido: ${oldest.name}`);
        }
    }
}

export {createBackup}