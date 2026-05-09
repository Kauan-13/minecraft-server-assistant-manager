import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"

import type { Player } from "../../types/Server"
import { useMemo } from "react"

type Props = {
    players?: Player[]
}

const COLOR_PALETTE = [
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400 border-red-800",
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400 border-orange-800",
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400 border-amber-800",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400 border-yellow-800",
    "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-400 border-lime-800",
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 border-green-800",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400 border-emerald-800",
    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-400 border-teal-800",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-400 border-cyan-800",
    "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-400 border-sky-800",
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400 border-blue-800",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400 border-indigo-800",
    "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-400 border-violet-800",
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-400 border-purple-800",
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-400 border-fuchsia-800",
    "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-400 border-pink-800",
    "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-400 border-rose-800",
]

const getColorFromName = (name: string, colorList: string[]) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i)
        hash |= 0
    }
    const index = Math.abs(hash) % colorList.length
    return colorList[index]
}

const getInitial = (name: string) => {
    return name.slice(0, 1).toUpperCase()
}

const ServerPlayersAvatar = ({ players = [] }: Props) => {

    const MAX_DISPLAYED_PLAYERS = 10
    const DISPLAYED_PLAYERS = players.slice(0, MAX_DISPLAYED_PLAYERS)
    const remainingCount = players.length - MAX_DISPLAYED_PLAYERS
    
    const playerColors = useMemo(() => {
        return DISPLAYED_PLAYERS.map((player) => ({
            name: player.name,
            color: getColorFromName(player.name, COLOR_PALETTE)
        }))
    }, [DISPLAYED_PLAYERS])

    return (
        <AvatarGroup>
            {
                DISPLAYED_PLAYERS.map((player, index) => (
                    <Tooltip>
                        <TooltipTrigger>
                            <Avatar key={ index }>
                                {/* <AvatarImage src={ } alt={ player.name } /> */}
                                <AvatarFallback className={ playerColors[index]?.color }>
                                    { getInitial(player.name) }
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>

                        <TooltipContent>
                            <p>{ player.name }</p>
                        </TooltipContent>
                    </Tooltip>
                ))
            }
            {
                remainingCount > 0 && (
                    <AvatarGroupCount>+{ remainingCount }</AvatarGroupCount>
                )
            }
        </AvatarGroup>
    )
}

export default ServerPlayersAvatar