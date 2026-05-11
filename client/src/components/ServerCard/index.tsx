import type { ApiError, Player, ServerStatus } from "../../types/Server";
import placeholderImage from "/placeholder.jpg";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import ServerStateButton from "../ServerStateButton";
import { Separator } from "../ui/separator";
import ServerPlayersAvatar from "../ServerPlayersAvatar";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
    bannerPath: string,
    serverName: string,
    serverStatus: ServerStatus,
    serverPlayers: Player[],
    
    error?: ApiError,

    onClickStart: () => void,
    onClickStop: () => void
}

const badgeColorMap: Record<ServerStatus, BadgeVariant> = {
    OFFLINE: 'secondary', STARTING: 'yellow', STOPPING: 'red', ONLINE: 'green'
}

const ServerCard = ({ bannerPath, serverName, serverStatus, serverPlayers, onClickStart, onClickStop, error }: Props) => {

    useEffect(() => {
        if (!error) return

        toast.error(
            `[${error.serverName}]: ${error.message}`,
            { id: `${error.serverName}-${error.message}` }
        )
    }, [error])

    return (
        <Card>
            <img
                src={ `${apiUrl}${bannerPath}` }
                alt="Server Profile Picture"
                className={cn(
                    "relative z-20 aspect-video w-full object-cover brightness-80 dark:brightness-40",
                    serverStatus !== 'ONLINE' && "grayscale"
                )}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholderImage
                }}
            />
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>{ serverName }</CardTitle>
                    <CardDescription>Um Servidor Minecraft</CardDescription>
                </div>
                <div className='flex gap-2'>
                    <Badge variant={ badgeColorMap[serverStatus] }>{  serverStatus }</Badge>
                </div>
            </CardHeader>

            <CardContent>
                <ServerStateButton
                    disabled={ Boolean(error) }
                    status={ serverStatus }
                    name={ serverName }
                    onClickStart={ onClickStart }
                    onClickStop={ onClickStop }
                />
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col items-start gap-3">
                
                <div className="flex w-full items-center justify-between">
                    <CardDescription className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <p>Players Online</p>
                    </CardDescription>
                    <Badge variant="outline">{  serverStatus === 'ONLINE' ? serverPlayers.length : 0 }</Badge>
                </div>
                
                {
                    serverPlayers.length > 0 && serverStatus === 'ONLINE'
                    ? (
                        <ServerPlayersAvatar players={serverPlayers} />
                    )
                    : (
                        <div className="flex w-full items-center justify-center py-2">
                            <p className="text-sm text-muted-foreground">Nenhum player online</p>
                        </div>
                    )
                }
            </CardFooter>

        </Card>
    )

}

export default ServerCard