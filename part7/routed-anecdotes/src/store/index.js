import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import blogReducer from './blogSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});

export default store;
