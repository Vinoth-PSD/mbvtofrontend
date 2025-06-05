import Header from './components/Header'
import LookGenerator from './components/LookGenerator'
import GoogleAnalytics from './components/GoogleAnalytics'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <GoogleAnalytics />
      <Header />
      <main className="flex-1 flex flex-col">
        <LookGenerator />
      </main>
    </div>
  )
}

export default App 