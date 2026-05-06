interface ServerConfig {
    id: number;
    name: string;
    path: string;
    port: number;
    rconPort: number;
}

interface AllowedUser {
    name: string;
    ips: string[];
}

interface SecurityConfig {
    enableIpWhitelist: boolean;
    requireToken: boolean;
    allowedUsers: AllowedUser[];
    CorsURLs: string[];
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

export type { AppConfig };