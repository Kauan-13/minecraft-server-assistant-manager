import style from "./style.module.css";
import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import AuthorizationPopup from "../AuthorizationPopup";

const CardSection = () => {
    const {
        servers,  
        fetchStart, 
        fetchStop,
        error,
        isErrorPopupOpen,
        setIsErrorPopupOpen
    } = useServer();

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
                                error?.message && error.serverName == server.name ? error?.message : "" 
                            } 
                            onClickStart={() => fetchStart(server.id, server.name)}
                            onClickStop={() => fetchStop(server.id, server.name)}
                        />
                    ))
                }
            </section>
            { isErrorPopupOpen &&
                <AuthorizationPopup onClose={() => setIsErrorPopupOpen(false)}/>
            }
        </>
    )
}

export default CardSection;