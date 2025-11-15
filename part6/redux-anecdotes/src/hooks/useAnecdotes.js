import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createNew, updateAnecdote } from '../services/anecdotes'
import { useNotificationDispatch } from '../NotificationContext'

export const useAnecdotes = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    onError: () => {
      throw new Error('Error al cargar las anécdotas')
    }
  })
}

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  return useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: `Añadida: "${newAnecdote.content}"` })
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Error al crear la anécdota' })
    }
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  return useMutation({
    mutationFn: ({ id, newObject }) => updateAnecdote(id, newObject),
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: `Votada: "${updatedAnecdote.content}"` })
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Error al votar' })
    }
  })
}