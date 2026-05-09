import ServerCard from "./components/ServerCard"
import CardSection from "./components/ServerCardSection"

const App = () => {
    return (
        <main className='max-w-[1200px] min-w-[320px] m-auto p-4'>
            {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                <ServerCard />
                <ServerCard />
            </div> */}
            <CardSection />
        </main>
    )
}

export default App
