import Header from "./components/Header"
import CardSection from "./components/ServerCardSection"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {

    const queryClient = new QueryClient();

    return (
        <main className='max-w-[1200px] min-w-[320px] m-auto p-4'>
            <Header />
            <QueryClientProvider client={queryClient}>
                <CardSection />
            </QueryClientProvider>
        </main>
    )
}

export default App
