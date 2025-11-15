import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createNew, updateAnecdote } from '../services/anecdotes'
import { useNotification } from './useNotification'

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
  const showNotification = useNotification()

  return useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`Añadida: "${newAnecdote.content}"`)
    },
    onError: (error) => {
      if (error.response?.data?.error?.includes('too short')) {
        showNotification('La anécdota debe tener al menos 5 caracteres', 5)
      } else {
        showNotification('Error al crear la anécdota', 5)
      }
    }
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotification()

  return useMutation({
    mutationFn: ({ id, newObject }) => updateAnecdote(id, newObject),
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`Votada: "${updatedAnecdote.content}"`)
    },
    onError: () => {
      showNotification('Error al votar', 5)
    }
  })
}