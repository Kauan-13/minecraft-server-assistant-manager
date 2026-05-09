import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"
import { Button } from "../../ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useTheme } from "../../theme-provider"
import type { JSX } from "react";

type Props = {
    className?: string
    info: {
        repository: { icon: JSX.Element, url: string, tooltip: string },
        theme: { lightIcon: JSX.Element, darkIcon: JSX.Element, tooltip: JSX.Element,  }
    }
}

const OptionButtons = ({ info, className = '' }: Props) => {

    const { theme, setTheme } = useTheme()

    return (
        <div className={ className } >
            <ButtonGroup>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className='cursor-pointer'
                            variant='outline'
                            size='lg'
                            onClick={() => window.open(info.repository.url, '_blank')}
                        >
                            { info.repository.icon }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{ info.repository.tooltip }</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className='cursor-pointer'
                            variant='outline'
                            size='lg'
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {
                            theme === 'dark'
                                ? info.theme.lightIcon
                                : info.theme.darkIcon
                            }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{ info.theme.tooltip }</TooltipContent>
                </Tooltip>
            </ButtonGroup>
        </div>
    )

}

export default OptionButtons