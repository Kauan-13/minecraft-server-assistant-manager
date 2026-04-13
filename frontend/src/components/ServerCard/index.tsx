import type { Player, ServerStatus } from "../../types/Server";
import style from "./style.module.css";

interface Props {
    serverName: string,
    serverStatus: ServerStatus,
    serverPlayers: Player[],
    error?: string,
    onClickStart: () => {},
    onClickStop: () => {}
}

const ServerCard = ({serverName, serverStatus, serverPlayers, onClickStart, onClickStop, error}: Props) => {
    return (
        <div className={style.serverCard}>
            <div className={style.serverCardBackground}>
                <div className={style.topServerCard}>
                    <h2>{serverName}</h2>
                    <div className={style.status}>
                        <p>Status:</p> 
                        <div className={
                            `${style.ball} 
                            ${serverStatus == "STARTING" || serverStatus == "STOPPING" ? style.yellow : null}
                            ${serverStatus == "ONLINE" && style.green}`}></div>
                        {serverStatus} ({serverPlayers.length})
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
        </div>
    )
}

export default ServerCard;