import useServer from '../../hooks/useServer';
import ServerCard from "../ServerCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthorizationDialog from "../AuthorizationDialog";

const CardSection = () => {
    const {
        servers,
        fetchStart, 
        fetchStop,
        error,
        isErrorDialogOpen,
        setIsErrorDialogOpen
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

                            error={ error }

                            onClickStart={ () => fetchStart(server.id, server.name) }
                            onClickStop={ () => fetchStop(server.id, server.name) }
                        />
                    ))
                }
            </section>
            
            <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <AuthorizationDialog onClose={() => setIsErrorDialogOpen(false)}/>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CardSection;