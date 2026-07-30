import fs  from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';

const zip = new AdmZip();

const createBackup = async (serverPath: string) => {
    try {

        console.log("gerando backup");

        const backupDir = path.join(serverPath,'backups');
        const sourceDir = path.join(serverPath,'world');

        await fs.ensureDir(backupDir);

        // 2. Gera o nome do arquivo no formato: backup_YYYYMMDD_HHmm.zip
        const now = new Date();
        const pad = (num: number) => String(num).padStart(2, '0');
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        const fileName = `backup_${timestamp}.zip`;
        const outputPath = path.join(backupDir, fileName);

        // 3. Compacta o diretório de origem em formato .zip
        zip.addLocalFolder(sourceDir, '');

        await zip.writeZipPromise(outputPath);
        
        console.log(`Backup criado com sucesso: ${fileName}`);

        // // 4. Remove backups antigos que excederem o limite
        // await rotateBackups(backupDir, maxBackups);

        return outputPath;
    } catch (error) {
        console.error('Erro ao gerar o backup:', error);
        throw error;
    }
}

export {createBackup}