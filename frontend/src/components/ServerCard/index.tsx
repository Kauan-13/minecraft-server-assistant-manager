import type { Player, ServerStatus } from "../../types/Server";
import style from "./style.module.css";
const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
    bannerPath: string,
    serverName: string,
    serverStatus: ServerStatus,
    serverPlayers: Player[],
    error?: string,
    onClickStart: () => void,
    onClickStop: () => void
}

const ServerCard = ({bannerPath, serverName, serverStatus, serverPlayers, onClickStart, onClickStop, error}: Props) => {
    return (
        <div className={style.serverCard}>
            <img 
                src={`${apiUrl}${bannerPath}`} alt="Server Banner" 
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/server_background.jpg';
                }}
            />
            <div className={style.topServerCard}>
                <h2>{serverName}</h2>
                <div className={style.status}>
                    <p>Status:</p> 
                    <div className={
                        `${style.ball} 
                        ${serverStatus == "STARTING" || serverStatus == "STOPPING" ? style.yellow : null}
                        ${serverStatus == "ONLINE" && style.green}`}></div>
                    <div className={style.statusLength}>
                        {serverStatus} (<span>{serverPlayers.length}</span>)
                    </div>
                    {serverPlayers.length > 0 &&
                        <div className={style.playerList}>
                            {
                                serverPlayers.map((player, index) => (
                                    <div key={index} className={style.player}>
                                        <img src={`${apiUrl}${player.avatar}`} alt="Player Avatar" />
                                        <p key={index}>{player.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
            <div className={style.error}>
                <p>{error}</p>
            </div>
            <div className={style.buttons}>
                <button className={style.startButton} onClick={onClickStart} disabled={
                    serverStatus == "ONLINE" || serverStatus == "STARTING" || serverStatus == "STOPPING"}
                >Iniciar</button>
                <button className={style.stopButton} onClick={onClickStop} disabled={
                    serverStatus == "OFFLINE" || serverStatus == "STOPPING" || serverStatus == "STARTING"}
                >Parar</button>
            </div> 
        </div>
    )
}

export default ServerCard;