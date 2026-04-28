import { Rcon } from 'rcon-client';
import { env } from '../config/index.js';

const rconPassword = env.RCON_PASSWORD || "";

const connectRcon = (port: number) => {
    return Rcon.connect({ 
        host: "127.0.0.1", 
        port: port, 
        password: rconPassword })
};

const sendCommand = async (port: number, command: string) => {
    const rcon = await connectRcon(port);
    const response = await rcon.send(command);
    await rcon.end();
    return response;
};

export {sendCommand}