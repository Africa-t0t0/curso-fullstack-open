import { useNotificationDispatch } from '../NotificationContext.jsx'
import { useEffect } from 'react'

export const useNotification = () => {
  const dispatch = useNotificationDispatch()
  
  const setNotification = (message, seconds = 5) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    
    // Clear notification after specified seconds
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, seconds * 1000)
  }
  
  return setNotification
}
