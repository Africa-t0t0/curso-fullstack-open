import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null, // 'success', 'error', etc.
  timeoutId: null
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const { message, type } = action.payload;
      clearTimeout(state.timeoutId);
      return {
        message,
        type: type || 'info',
        timeoutId: null
      };
    },
    clearNotification(state) {
      return {
        message: null,
        type: null,
        timeoutId: null
      };
    },
    setTimeoutId(state, action) {
      state.timeoutId = action.payload;
    }
  },
});

export const { setNotification, clearNotification, setTimeoutId } = notificationSlice.actions;

export const setTimedNotification = (message, type = 'info', duration = 5000) => {
  return async (dispatch, getState) => {
    const { timeoutId } = getState().notification;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    dispatch(setNotification({ message, type }));
    
    const newTimeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, duration);
    
    dispatch(setTimeoutId(newTimeoutId));
  };
};

export default notificationSlice.reducer;
