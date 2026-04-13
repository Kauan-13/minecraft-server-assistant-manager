import style from "./style.module.css";
import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import AuthorizationPopup from "../AuthorizationPopup";
import { useEffect, useState } from "react";

const CardSection = () => {
    const {
        servers,  
        fetchStart, 
        errorStart, 
        fetchStop,
        errorStop
    } = useServer();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                            error={
                                errorStart?.message && errorStart.serverName == server.name ? errorStart?.message : 
                                errorStop?.message && errorStop.serverName == server.name ? errorStop?.message : ""
                            } 
                            onClickStart={() => fetchStart(server.id, server.name)}
                            onClickStop={() => fetchStop(server.id, server.name)}
                        />
                    ))
                }
            </section>
            { isPopupOpen &&
                <AuthorizationPopup onClose={() => setIsPopupOpen(false)}/>
            }
        </>
    )
}

export default CardSection;