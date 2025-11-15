import { createContext, useContext } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children, notificationDispatch }) => {
  return (
    <NotificationContext.Provider value={notificationDispatch}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationDispatch = () => {
  return useContext(NotificationContext)
}