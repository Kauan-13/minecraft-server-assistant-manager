import { useState, useEffect, useCallback } from 'react';
import { urlStart, urlStatus, urlStop } from '../api/api';
import type { Server } from '../types/Server';

const useServer = ( intervalMs = 5000) => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    
    const [serverStartResponse, setServerStartResponse] = useState<{message: string}>(null);
    const [loadingStart, setLoadingStart] = useState(false);
    const [errorStart, setErrorStart] = useState<{message: string, status: number} | null>(null);

    const [serverStopResponse, setServerStopResponse] = useState<{message: string}>(null);
    const [loadingStop, setLoadingStop] = useState(false);
    const [errorStop, setErrorStop] = useState<{message: string, status: number} | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await urlStatus();
            setServers(response);
            setErrorStatus(null);
        } catch (err: any) {
            const message = err.response?.data?.error || "Erro ao conectar com o servidor";
            setErrorStatus(message);
            setServers(null); 
        } finally {
            setLoadingStatus(false);
        }
    }, []);

    const fetchStart = async (serverId: number) => {
        setLoadingStart(true);
        try {
            const response = await urlStart(serverId);
            setServerStartResponse(response);
            setErrorStart(null);
        } catch (err: any) {
            console.log(err);

            const message = err.response?.data?.message || "Erro ao conectar com o servidor";
            setErrorStart({
                message: message,
                status: err.response?.status || 500
            });
            setServerStartResponse(null);
            
            setTimeout(() => {
                setErrorStart(null);
            }, 5000);
        } finally {
            setLoadingStart(false);
        }
    }

    const fetchStop = async (serverId: number) => {
        setLoadingStop(true);
        try {
            const response = await urlStop(serverId);
            setServerStopResponse(response);
            setErrorStop(null);
        } catch (err: any) {
            const message = err.response?.data?.message || "Erro ao conectar com o servidor";
            setErrorStop({
                message: message,
                status: err.response?.status || 500
            });
            setServerStopResponse(null); 

            setTimeout(() => {
                setErrorStop(null);
            }, 5000);
        } finally {
            setLoadingStop(false);
        }
    }

    useEffect(() => {
        fetchStatus();

        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchStatus();
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [fetchStatus, intervalMs]);

    return { servers, loadingStatus, errorStatus, serverStartResponse, errorStart, loadingStart, fetchStart, serverStopResponse, errorStop, loadingStop, fetchStop };
}

export default useServer;