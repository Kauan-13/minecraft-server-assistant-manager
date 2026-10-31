import { google, drive_v3 } from 'googleapis';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.join(__dirname, '../../data/google_token.json');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const isDriveAuthenticated = () => {
    return fs.existsSync(TOKEN_PATH);
};

const rotateDriveBackups = async (drive: drive_v3.Drive, folderId: string, maxBackups: number) => {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and mimeType='application/zip' and trashed=false`,
            orderBy: 'createdTime',
            fields: 'files(id, name, createdTime)',
        });

        const files = res.data.files || [];

        if (files.length > maxBackups) {
            const backupsToDelete = files.length - maxBackups;
            
            for (let i = 0; i < backupsToDelete; i++) {
                const file = files[i];
                await drive.files.delete({ fileId: file!.id! });
                
                logger.info('Backup antigo removido do Google Drive', {
                    context: 'DRIVE_BACKUP',
                    fileName: file!.name
                });
            }
        }
    } catch (err) {
        logger.warn('Erro ao rotacionar backups no Google Drive', {
            context: 'DRIVE_BACKUP',
            error: err instanceof Error ? err.message : String(err)
        });
    }
};

const uploadBackupToDrive = async (filePath: string, fileName: string, maxBackups: number, folderId: string) => {
    if (!isDriveAuthenticated()) {
        const msg = 'Google Drive não configurado. Execute "npm run drive:auth" no terminal.';
        logger.warn(msg, { context: 'DRIVE_BACKUP', fileName });
        throw new Error(msg);
    }

    logger.info('Iniciando upload do backup para o Google Drive', {
        context: 'DRIVE_BACKUP',
        fileName
    });

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(token);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId]
        },
        media: {
            mimeType: 'application/zip',
            body: fs.createReadStream(filePath),
        },
        fields: 'id, name, webViewLink',
    });

    logger.info('Upload do backup para o Google Drive concluído', {
        context: 'DRIVE_BACKUP',
        fileName
    });

    await rotateDriveBackups(drive, folderId, maxBackups);

    return response.data;
};

export { uploadBackupToDrive };