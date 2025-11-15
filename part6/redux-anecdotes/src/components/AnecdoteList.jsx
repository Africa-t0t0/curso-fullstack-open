import { useAnecdotes, useVoteAnecdote } from '../hooks/useAnecdotes'
import { useSelector } from 'react-redux'

const AnecdoteList = () => {
  const { data: anecdotes, isLoading, isError } = useAnecdotes()
  const voteMutation = useVoteAnecdote()
  const filter = useSelector(state => state.filter)

  if (isLoading) return <div>Cargando anécdotas...</div>
  if (isError) return <div>Error al cargar las anécdotas</div>

  const filteredAnecdotes = anecdotes
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate({
              id: anecdote.id,
              newObject: { ...anecdote, votes: anecdote.votes + 1 }
            })}>
              vote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList