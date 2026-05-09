import { Box, GitFork, Moon, Sun } from "lucide-react"
import { useTheme } from "../theme-provider"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Kbd } from "../ui/kbd"

const Header = () => {
    const { theme, setTheme } = useTheme()

    return (
        <header className="grid grid-cols-3 items-center px-6 py-4 border-b w-full mb-8">
            <div className='flex items-center gap-2 justify-start'>
                <Box className="h-5 w-5" />
                <p className="font-semibold">Server Assistant Manager</p>
            </div>

            <p className="text-muted-foreground text-center">Servers</p>

            <div className="flex justify-end mr-13">
                <ButtonGroup>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className='cursor-pointer'
                                variant='outline'
                                size='lg'
                                onClick={() => window.open('https://github.com/Kauan-13/minecraft-server-assistant-manager', '_blank')}
                            >
                                <GitFork className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>GitHub Repository</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className='cursor-pointer'
                                variant='outline'
                                size='lg'
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? (
                                    <Sun className='h-4 w-4 stroke-amber-400' />
                                ) : (
                                    <Moon className='h-4 w-4 stroke-indigo-400' />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Theme <Kbd>D</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </ButtonGroup>
            </div>
        </header>
    )
}

export default Header