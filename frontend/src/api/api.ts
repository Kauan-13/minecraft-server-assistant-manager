import axios from 'axios';
import type { Server } from '../types/Server';
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl,
});

const urlStatus = async (): Promise<Server[]> => {
    const response = await api.get("/status");
    return response.data;
}

const urlStart = async (serverId: number) => {
    const response = await api.post("/start", {serverId:serverId}, {
        headers: { 'x-api-token': localStorage.getItem("minecraft-api-token") }
    });

    return response.data;
}

const urlStop = async (serverId: number) => {
    const response = await api.post("/stop", {serverId:serverId}, {
        headers: { 'x-api-token': localStorage.getItem("minecraft-api-token") }
    });

    return response.data;
}

export { urlStatus, urlStart, urlStop }