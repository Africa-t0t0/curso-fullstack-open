import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Acción asíncrona para mostrar una notificación por un tiempo determinado
export const showNotification = (message, seconds = 5) => {
  return async dispatch => {
    dispatch(setNotification(message))

    // Limpiar cualquier temporizador existente
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout)
    }

    // Establecer un nuevo temporizador para limpiar la notificación
    window.notificationTimeout = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
