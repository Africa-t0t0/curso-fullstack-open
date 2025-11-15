import { useNotificationValue } from '../NotificationContext.jsx'

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'lightgrey'
  }

  // Si no hay notificación, no renderizar nada
  if (!notification) {
    return null
  }

  return <div style={style}>{notification}</div>
}

export default Notification
