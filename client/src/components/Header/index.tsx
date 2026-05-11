import { Box, Menu } from "lucide-react"
import OptionButtons from "./OptionButtons"
import { Drawer, DrawerTrigger, } from "@/components/ui/drawer"
import DrawerOptions from "./DrawerOptions"
import { TbBrandGithub } from "react-icons/tb";
import { Moon, Sun } from "lucide-react"
import { Kbd } from "../ui/kbd"

const Header = () => {

    const data = {
        repository: {
            icon: <TbBrandGithub />,
            url: 'https://github.com/Kauan-13/minecraft-server-assistant-manager',
            tooltip: 'Repositório GitHub'
        },
        theme: {
            lightIcon: <Sun className='h-4 w-4 stroke-amber-400' />,
            darkIcon: <Moon className='h-4 w-4 stroke-indigo-400' />,
            tooltip: (
                <span className="flex items-center gap-1">
                    Tema <Kbd>D</Kbd>
                </span>
            )
        }
    }

    return (
        <header className="grid grid-cols-3 items-center px-6 py-4 border-b w-full mb-8">
            <div className='flex items-center gap-2 justify-start'>
                <Box className="h-5 w-5" />
                <p className="font-semibold hidden md:block">Server Assistant Manager</p>
            </div>

            <p className="text-muted-foreground text-center">Servidores</p>

            <div className="flex justify-end mr-0 md:mr-13">
                <OptionButtons data={ data } className='hidden md:block' />
                <Drawer>
                    <DrawerTrigger className='block md:hidden w-fit'>
                        <Menu />
                    </DrawerTrigger>
                    <DrawerOptions data={ data } />
                </Drawer>
            </div>
        </header>
    )
}

export default Header