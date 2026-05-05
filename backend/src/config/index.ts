import 'dotenv/config';
import config from '../../config.json' with { type: 'json' };

const env = {
    PORT: process.env.PORT || 3000,
    API_TOKEN: process.env.API_TOKEN!,
    RCON_PASSWORD: process.env.RCON_PASSWORD!,
    DISCORD_WEB_HOOK: process.env.URL_DISCORD_WEBHOOK!,
    RADMIN_IP: process.env.RADMIN_IP,
    FRONTEND_URL: process.env.FRONTEND_URL
};

export { env, config }