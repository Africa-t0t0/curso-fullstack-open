import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h2>Anecdotes</h2>
        <Notification />
        <Filter />
        <AnecdoteList />
        <AnecdoteForm />
      </div>
    </QueryClientProvider>
  )
}

export default App