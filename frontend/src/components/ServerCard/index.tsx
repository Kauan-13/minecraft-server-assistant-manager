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

const serverPlayersMock: Player[] = [{name: "Michael",raw: "I'm not superstitious, but I am a little stitious."},{name: "Jim",raw: "Everything I have I owe to this job. This stupid, wonderful, boring, amazing job."},{name: "Pam",raw: "There's a lot of beauty in ordinary things. Isn't that kind of the point?"},{name: "Dwight",raw: "Identity theft is not a joke, Jim! Millions of families suffer every year!"}]

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
                        <div className={style.statusLength}>
                            {serverStatus} (<span>{serverPlayers.length}</span>)
                        </div>
                        {serverPlayers.length > 0 &&
                            <div className={style.playerList}>
                                {
                                    serverPlayers.map((player, index) => (
                                        <p key={index}>{player.name}</p>
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
        </div>
    )
}

export default ServerCard;