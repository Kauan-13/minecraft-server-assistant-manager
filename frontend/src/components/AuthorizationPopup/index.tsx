import { useState } from "react";
import style from "./style.module.css";
import { IoMdClose } from "react-icons/io";

interface Props {
    onClose: () => void
}

const AuthorizationPopup = ({onClose}: Props) => {
    const [token, setToken] = useState(localStorage.getItem("minecraft-api-token") || "");

    const handleSubmit = (token: string) => {
        localStorage.setItem("minecraft-api-token", token);
        onClose();
    }

    return (
        <>
            <div className={style.authorizationPopup}>
                <div className={style.topPopup}>
                    <h3>Autenticação</h3>
                    <IoMdClose onClick={onClose}/>
                </div>
                <div className={style.inputDiv}>
                    <label htmlFor="tokenInput">Token:</label>
                    <input value={token} onChange={event => setToken(event.target.value)} type="text" name="tokenInput" id="tokenInput" placeholder="insira o token..."/>
                </div>
                <button onClick={() => handleSubmit(token)}>Confirmar</button>
            </div>
            <div className={style.background}></div>
        </>
    )
}

export default AuthorizationPopup;