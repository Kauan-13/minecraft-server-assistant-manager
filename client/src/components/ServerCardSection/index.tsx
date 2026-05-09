import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthorizationPopup from "../AuthorizationDialog";

// Mock data for when useServer isn't ready
const MOCK_SERVERS = [
    {
        id: 1,
        name: "Survival",
        status: "ONLINE" as const,
        players: [
            { name: "sioterino", raw: "idk?" },
            { name: "kauan", raw: "idk?" },
            { name: "tmarino", raw: "idk?" }
        ]
    },
    {
        id: 2,
        name: "Creative",
        status: "OFFLINE" as const,
        players: []
    },
    {
        id: 3,
        name: "MiniGames",
        status: "STARTING" as const,
        players: [
            { name: "player1", raw: "idk?" },
            { name: "player2", raw: "idk?" }
        ]
    }
];

const CardSection = () => {
    const {
        servers = MOCK_SERVERS,  // Use mock as fallback
        fetchStart, 
        fetchStop,
        error,
        isErrorPopupOpen,
        setIsErrorPopupOpen
    } = useServer();

    return (
        <>
            <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {
                    servers && servers.map((server, index) => (
                        <ServerCard 
                            key={ index }
                            serverName={ server.name } 
                            serverStatus={ server.status }
                            serverPlayers={ server.players }
                            error={ error?.message && error.serverName == server.name ? error?.message : ""  } 
                            onClickStart={ () => fetchStart(server.id, server.name) }
                            onClickStop={ () => fetchStop(server.id, server.name) }
                        />
                    ))
                }
            </section>
            
            <Dialog open={isErrorPopupOpen} onOpenChange={setIsErrorPopupOpen}>
                <DialogContent className="sm:max-w-md">
                    <AuthorizationPopup onClose={() => setIsErrorPopupOpen(false)}/>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CardSection;