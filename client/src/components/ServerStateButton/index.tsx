import type { ServerStatus } from "@/types/Server"
import type React from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button, type buttonVariantTypes } from "../ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Power, PowerOff } from "lucide-react"

type Props = {
    disabled: boolean
    status: ServerStatus
    name: string
    onClickStart?: () => void,
    onClickStop?: () => void
}

const getStatusButtonMap = (disabled: boolean): Record<ServerStatus, React.ReactNode> => ({
    OFFLINE: (
        <Button disabled={disabled}>
            Abrir Servidor
        </Button>
    ),

    STARTING: (
        <Button disabled>
            <Spinner data-icon="inline-start" />
            Abrindo Servidor
        </Button>
    ),

    ONLINE: (
        <Button
            variant="destructive"
            disabled={disabled}
        >
            Fechar Servidor
        </Button>
    ),

    STOPPING: (
        <Button variant="destructive" disabled>
            <Spinner data-icon="inline-start" />
            Fechando Servidor
        </Button>
    ),
})

const ServerStateButton = ({ disabled, status, name, onClickStart, onClickStop }: Props) => {
    
    const statusButtonMap = getStatusButtonMap(disabled)

    const getDialogContent = () => {
        if (status === 'OFFLINE')
            return {
                mediaClassName: '',
                icon: <Power />,
                title: "Abrir Servidor?",
                description: `Tem certeza que deseja abrir o Servidor '${name}'?`,
                actionVariant: 'default',
                actionText: "Abrir Servidor",
                onAction: onClickStart
            }
        
        if (status === 'ONLINE')
            return {
                mediaClassName: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
                icon: <PowerOff />,
                title: "Fechar Servidor?",
                description: `Tem certeza que deseja fechar o Servidor '${name}'? Caso haja players online, essa ação não obterá êxito.`,
                actionVariant: 'destructive',
                actionText: "Fechar Servidor",
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
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
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