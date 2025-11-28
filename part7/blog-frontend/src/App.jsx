import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Feedback from './components/Feedback'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, status: null })

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => (
        console.log(blogs),
        blogs.sort((a, b) => b.likes - a.likes),
        setBlogs(blogs)
      )
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(createdBlog => {
        const blogWithUser = {
          ...createdBlog,
          user: createdBlog.user || {
            username: user.username,
            name: user.name,
            id: user.id
          },
          likes: createdBlog.likes || 0,
          likedBy: createdBlog.likedBy || []
        };

        setBlogs(blogs.concat(blogWithUser));

        setNotification({
          message: `A new blog "${createdBlog.title}" by ${createdBlog.author} added`,
          status: 'success'
        });
        setTimeout(() => {
          setNotification({ message: null, status: null });
        }, 5000);
      })
      .catch(error => {
        console.error('Error creating blog:', error);
        setNotification({
          message: 'Failed to create blog',
          status: 'error'
        });
        setTimeout(() => {
          setNotification({ message: null, status: null });
        }, 5000);
      });
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'welcome back ' + user.username, status: 'success' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)

    } catch (error) {
      console.log(error)
      setNotification({ message: error.response.data.error, status: 'error' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)

    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (blog) => {
    const hasLiked = blog.likedBy && blog.likedBy.some(
      like => like.username === user.username
    );
    console.log('hasLiked', blog.likedBy)

    if (hasLiked) {
      setNotification({ message: 'You have already liked this blog', status: 'error' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)
      return
    }
    const likedBlog = { ...blog, likes: blog.likes + 1, likedBy: [...blog.likedBy, { id: user.id, username: user.username }] }
    console.log('likedBlog', likedBlog)
    await blogService.update(blog.id, likedBlog)
    setBlogs(blogs.map(blog => blog.id !== likedBlog.id ? blog : likedBlog))
  }

  const handleRemove = async (blogToRemove) => {
    try {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
      setNotification({
        message: `Blog "${blogToRemove.title}" was successfully removed`,
        status: 'success'
      });
      setTimeout(() => {
        setNotification({ message: null, status: null });
      }, 5000);
    } catch (error) {
      setNotification({ message: error.response.data.error, status: 'error' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)
    }
  }

  const loginForm = () => {

    return (
      <Togglable buttonLabel="login">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    );
  }

  const blogForm = (
    <Togglable buttonLabel="new blog" initialVisible={false}>
      <BlogForm
        createBlog={createBlog}
      />
    </Togglable>
  )

  return (
    <div>
      {user === null ? loginForm() : blogForm}
      <Feedback message={notification.message} status={notification.status} />
      {user !== null && (
        <div>
          <p>{user.username} logged in</p>
          <button onClick={handleLogOut}>logout</button>
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div key={blog.id}>
          {blog.title}
          <Togglable key={blog.id} buttonLabel="view">
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
          </Togglable>
        </div>
      )}
      <div>
        Full stack course 2025
      </div>
    </div>

  )
}

export default App