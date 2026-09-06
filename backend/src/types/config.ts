interface ServerConfig {
    id: number;
    name: string;
    path: string;
    port: number;
    rconPort: number;
    startup: StartupConfig;
    backup: BackupConfig;
}

interface StartupConfig {
    execType: 'jar' | 'bat';
    targetFile: string;
    javaPath: string;
    minRam: string;     
    maxRam: string;
}

interface AllowedUser {
    name: string;
    ips: string[];
}

interface SecurityConfig {
    enableIpWhitelist: boolean;
    requireToken: boolean;
    allowedUsers: AllowedUser[];
    corsURLs: string[];
}

interface IntegrationsConfig {
    enableDiscord: boolean;
}

interface AppConfig {
    maxConcurrentServers: number;
    integrations: IntegrationsConfig;
    servers: ServerConfig[];
    security: SecurityConfig;
}

interface BackupConfig {
    maxBackups: number;
    backupPath: string;
}

export type { AppConfig, AllowedUser, ServerConfig };