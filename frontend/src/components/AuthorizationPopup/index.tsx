import { useState } from "react";

const AuthorizationPopup = () => {
    const [token, setToken] = useState(localStorage.getItem("minecraft-api-token"));

    const handleSubmit = (token: string) => {
        localStorage.setItem("minecraft-api-token", token);
    }

    return (
        <div>
            <h3>Autenticação:</h3>
            <label htmlFor="tokenInput">Token:</label>
            <input value={token} onChange={event => setToken(event.target.value)} type="text" name="tokenInput" id="tokenInput" placeholder="insira o token..."/>
            <button onClick={() => handleSubmit(token)}>Confirmar</button>
        </div>
    )
}

export default AuthorizationPopup;