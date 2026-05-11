import { useState } from 'react';
import { urlStart, urlStatus, urlStop } from '../api/api';
import type { ApiError, Server } from '../types/Server';
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useServer = ( intervalMs = 5000) => {

    const [ error, setError ] = useState<ApiError>(null);
    const [ isErrorDialogOpen, setIsErrorDialogOpen ] = useState(false);

    const { data: servers = [], } = useQuery<Server[]>({
        queryKey: ['servers'],
        queryFn: urlStatus,
        refetchInterval: intervalMs,
        refetchOnWindowFocus: true, 
    });

    const fetchStart = async (serverId: number, serverName: string) => {
        try {

            await urlStart(serverId);
            setError(null);

        } catch (err: unknown) {

            if (axios.isAxiosError(err)) {

                const message = err.response?.data?.error || "Erro ao conectar com o servidor";

                setError({
                    message: message,
                    status: err.response?.status || 500,
                    serverName: serverName
                });
                
                if (err.response?.status == 401)
                    setIsErrorDialogOpen(true);

                setTimeout(() => { setError(null) }, 5000);
            }

        }
    }

    const fetchStop = async (serverId: number, serverName: string) => {
        try {

            await urlStop(serverId);
            setError(null);

        } catch (err: unknown) {

            if (axios.isAxiosError(err)) {

                const message = err.response?.data?.error || "Erro ao conectar com o servidor";

                setError({
                    message: message,
                    status: err.response?.status || 500,
                    serverName: serverName
                });

                if (err.response?.status == 401)
                    setIsErrorDialogOpen(true);

                setTimeout(() => { setError(null) }, 5000);
            }

        }
    }

    return { servers, error, fetchStart, fetchStop, isErrorDialogOpen, setIsErrorDialogOpen };
}

export default useServer;