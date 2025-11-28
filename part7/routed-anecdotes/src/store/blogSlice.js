import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter(blog => blog.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    // This will be implemented later with the actual API call
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    // This will be implemented later with the actual API call
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    // This will be implemented later with the actual API call
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    // This will be implemented later with the actual API call
  };
};

export default blogSlice.reducer;
