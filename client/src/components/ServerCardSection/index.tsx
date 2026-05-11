import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthorizationPopup from "../AuthorizationDialog";

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
            <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {
                    servers && servers.map((server, index) => (
                        <ServerCard 
                            key={ index }
                            bannerPath={ server.bannerPath } 
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