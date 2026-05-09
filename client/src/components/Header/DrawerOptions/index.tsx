
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, } from "@/components/ui/drawer"
import { Button } from "../../ui/button"
import { useTheme } from "@/components/theme-provider"
import type { JSX } from "react"

type Props = {
    className?: string
    info: {
        repository: { icon: JSX.Element, url: string, tooltip: string },
        theme: { lightIcon: JSX.Element, darkIcon: JSX.Element, tooltip: JSX.Element,  }
    }
}

const DrawerOptions = ({ info }: Props) => {

    const { theme, setTheme } = useTheme()

    return (
        <DrawerContent>

            <DrawerHeader>
                <DrawerTitle>Quick Actions</DrawerTitle>
                <DrawerDescription>Repository access and appearance settings.</DrawerDescription>
            </DrawerHeader>

            <DrawerFooter>

                <div className="flex gap-2">
                    <Button
                        className='cursor-pointer w-1/2'
                        variant='outline'
                        size='lg'
                        onClick={() => window.open(info.repository.url, '_blank')}
                    >
                        { info.repository.icon }
                    </Button>
                    <Button
                        className='cursor-pointer w-1/2'
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
                </div>

            </DrawerFooter>

        </DrawerContent>
    )

}

export default DrawerOptions