import Header from "./components/Header"
import CardSection from "./components/ServerCardSection"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner'
import { useTheme } from "./components/theme-provider";

const App = () => {

    const queryClient = new QueryClient();
        const { theme } = useTheme()

    return (
        <>
            <main className='max-w-[1200px] min-w-[320px] m-auto p-4'>
                <Header />
                <QueryClientProvider client={queryClient}>
                    <CardSection />
                </QueryClientProvider>
            </main>
            <Toaster duration={ Infinity } richColors closeButton position="bottom-right" theme={theme} />
        </>
    )
}

export default App
