import type { ServerStatus } from "@/types/Server"
import type React from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button, type buttonVariantTypes } from "../ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Power, PowerOff } from "lucide-react"

type Props = {
    disabled: boolean
    status: ServerStatus
    onClickStart?: () => void,
    onClickStop?: () => void
}

const getStatusButtonMap = (disabled: boolean): Record<ServerStatus, React.ReactNode> => ({
    OFFLINE: (
        <Button disabled={disabled}>
            Start Server
        </Button>
    ),

    STARTING: (
        <Button disabled>
            <Spinner data-icon="inline-start" />
            Starting Server
        </Button>
    ),

    ONLINE: (
        <Button
            variant="destructive"
            disabled={disabled}
        >
            Stop Server
        </Button>
    ),

    STOPPING: (
        <Button variant="destructive" disabled>
            <Spinner data-icon="inline-start" />
            Stopping Server
        </Button>
    ),
})

const ServerStateButton = ({ disabled, status, onClickStart, onClickStop }: Props) => {
    
    const statusButtonMap = getStatusButtonMap(disabled)

    const getDialogContent = () => {
        if (status === 'OFFLINE')
            return {
                mediaClassName: '',
                icon: <Power />,
                title: "Start Server?",
                description: "Are you sure you want to start this Minecraft server?",
                actionVariant: 'default',
                actionText: "Start Server",
                onAction: onClickStart
            }
        
        if (status === 'ONLINE')
            return {
                mediaClassName: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
                icon: <PowerOff />,
                title: "Stop Server?",
                description: "Are you sure you want to stop this Minecraft server? This will kick all connected players.",
                actionVariant: 'destructive',
                actionText: "Stop Server",
                onAction: onClickStop
            }
        
        return null
    }

    const dialogContent = getDialogContent()
    
    if (!dialogContent || status === 'STARTING' || status === 'STOPPING')
        return <>{statusButtonMap[status]}</>

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                { statusButtonMap[status] }
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className={ dialogContent.mediaClassName }>
                        { dialogContent.icon }
                    </AlertDialogMedia>
                    
                    <AlertDialogTitle>{ dialogContent.title }</AlertDialogTitle>
                    <AlertDialogDescription>
                        { dialogContent.description }
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant={ dialogContent.actionVariant as buttonVariantTypes }
                        onClick={dialogContent.onAction}
                    >
                        { dialogContent.actionText }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ServerStateButton