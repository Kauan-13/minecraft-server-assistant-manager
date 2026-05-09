import type { Player, ServerStatus } from "../../types/Server";
import placeholderImage from "../../assets/placeholder.jpg";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import ServerStateButton from "../ServerStateButton";
import { Separator } from "../ui/separator";
import ServerPlayersAvatar from "../ServerPlayersAvatar";
import { Users } from "lucide-react";

type Props = {
    serverName?: string,
    serverStatus?: ServerStatus,
    serverPlayers?: Player[],
    error?: string,
    onClickStart?: () => void,
    onClickStop?: () => void
}

const badgeColorMap: Record<ServerStatus, BadgeVariant> = {
    OFFLINE: 'secondary', STARTING: 'yellow', STOPPING: 'red', ONLINE: 'green'
}

const ServerCard = (
    {
        serverName = 'Survival',
        serverStatus = 'OFFLINE',
        serverPlayers = [
            { name: 'sioterino', raw: 'idk?' },
            { name: 'kauan', raw: 'idk?' },
            { name: 'tmarino', raw: 'idk?' },
            { name: 'livia', raw: 'idk?' },
            { name: 'julia', raw: 'idk?' },
        ],
        onClickStart = () => {
            console.log('start')
        },
        onClickStop= () => {
            console.log('stop')
        },
        // error = 'error'
    }: Props
) => {

    return (
        // <Card className='max-w-[280px]'>
        <Card>
            <img
                src={ placeholderImage }
                alt="Server Profile Picture"
                className={cn(
                    "relative z-20 aspect-video w-full object-cover brightness-80 dark:brightness-40",
                    serverStatus !== 'ONLINE' && "grayscale"
                )}
            />
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>{ serverName }</CardTitle>
                    <CardDescription>A Minecraft Server</CardDescription>
                </div>
                <div className='flex gap-2'>
                    <Badge variant={ badgeColorMap[serverStatus] }>{  serverStatus }</Badge>
                </div>
            </CardHeader>

            <CardContent>
                <ServerStateButton
                    status={ serverStatus }
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
                            <p className="text-sm text-muted-foreground">No players online</p>
                        </div>
                    )
                }
            </CardFooter>

        </Card>
    )

}

export default ServerCard