import style from "./style.module.css";
import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import AuthorizationPopup from "../AuthorizationPopup";
import { useEffect, useState } from "react";

const CardSection = () => {
    const {
        servers, 
        loadingStatus, 
        errorStatus, 
        fetchStart, 
        loadingStart, 
        errorStart, 
        fetchStop,
        errorStop
    } = useServer();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    console.log(isPopupOpen);

    useEffect(() => {
        if (errorStart?.status == 401 || errorStop?.status == 401) {
            setIsPopupOpen(true);
        }
    }, [errorStart, errorStop])

    return (
        <>
            <section className={style.cardSection}>
                {servers &&
                    servers.map((server, index) => (
                        <ServerCard 
                            key={index} 
                            serverName={server.name} 
                            serverStatus={server.status}
                            serverPlayers={server.players} 
                            onClickStart={() => fetchStart(server.id)}
                            onClickStop={() => fetchStop(server.id)}
                        />
                    ))
                }
            </section>
            <p>{loadingStatus || loadingStart && "carregando"}</p>
            <p>{errorStatus || errorStart?.message || errorStop?.message}</p>
            { isPopupOpen &&
                <AuthorizationPopup onClose={() => setIsPopupOpen(false)}/>
            }
        </>
    )
}

export default CardSection;