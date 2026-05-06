import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'
import CardSection from './components/CardSection';
import Header from './components/Header';

const App = () => {
    
    const queryClient = new QueryClient();

    return (
        <>
            <Header/>
            <main>
                <QueryClientProvider client={queryClient}>
                <CardSection/>
                </QueryClientProvider>
            </main>
        </>
    )
}

export default App;
