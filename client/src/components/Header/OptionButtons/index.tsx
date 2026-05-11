import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"
import { Button } from "../../ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useTheme } from "../../theme-provider"
import type { JSX } from "react";

type Props = {
    className?: string
    data: {
        repository: { icon: JSX.Element, url: string, tooltip: string },
        theme: { lightIcon: JSX.Element, darkIcon: JSX.Element, tooltip: JSX.Element,  }
    }
}

const OptionButtons = ({ data, className = '' }: Props) => {

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
                            onClick={() => window.open(data.repository.url, '_blank')}
                        >
                            { data.repository.icon }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{ data.repository.tooltip }</TooltipContent>
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
                                ? data.theme.lightIcon
                                : data.theme.darkIcon
                            }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{ data.theme.tooltip }</TooltipContent>
                </Tooltip>
            </ButtonGroup>
        </div>
    )

}

export default OptionButtons