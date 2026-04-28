import axios from 'axios';

const sendMessage = async (message: string) => {
    try {
        await axios.post(process.env.URL_DISCORD_WEB_HOOK!, {
            "content": message
        })
    } catch (error: any) {
        console.error("Erro na API Externa:", error.message);
    }
}

export {sendMessage}