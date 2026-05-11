
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, } from "@/components/ui/drawer"
import { Button } from "../../ui/button"
import { useTheme } from "@/components/theme-provider"
import type { JSX } from "react"

type Props = {
    className?: string
    data: {
        repository: { icon: JSX.Element, url: string, tooltip: string },
        theme: { lightIcon: JSX.Element, darkIcon: JSX.Element, tooltip: JSX.Element,  }
    }
}

const DrawerOptions = ({ data }: Props) => {

    const { theme, setTheme } = useTheme()

    return (
        <DrawerContent>

            <DrawerHeader>
                <DrawerTitle>Ações Rápidas</DrawerTitle>
                <DrawerDescription>Acesse o Repositório da aplicação ou mude o tema.</DrawerDescription>
            </DrawerHeader>

            <DrawerFooter>

                <div className="flex gap-2">
                    <Button
                        className='cursor-pointer w-1/2'
                        variant='outline'
                        size='lg'
                        onClick={() => window.open(data.repository.url, '_blank')}
                    >
                        { data.repository.icon }
                    </Button>
                    <Button
                        className='cursor-pointer w-1/2'
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
                </div>

            </DrawerFooter>

        </DrawerContent>
    )

}

export default DrawerOptions