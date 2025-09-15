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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }


  const handleLogin = async (event) => {
    event.preventDefault()
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

  const handleBlogSubmit = async (event) => {
    try {
      event.preventDefault()
      const blogObject = {
        title: title,
        author: author,
        url: url,
      }
      const newBlog = await blogService.create(blogObject)
      setNotification({ message: 'a new blog ' + blogObject.title + ' by ' + blogObject.author + ' added', status: 'success' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error)
      setNotification({ message: error.response.data.error, status: 'error' })
      setTimeout(() => setNotification({ message: null, status: null }), 5000)
    }
  }

  const handleLike = async (blog) => {
    if (blog.likedBy.includes(user.username)) {
      alert('You have already liked this blog')
      return
    }
    const likedBlog = { ...blog, likes: blog.likes + 1, likedBy: user.username }
    await blogService.update(blog.id, likedBlog)
    setBlogs(blogs.map(blog => blog.id !== likedBlog.id ? blog : likedBlog))
  }

  const handleRemove = async (blog) => {
    await blogService.remove(blog.id)
    setBlogs(blogs.filter(blog => blog.id !== blog.id))
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
    <Togglable buttonLabel="new blog">
      <BlogForm
        handleSubmit={handleBlogSubmit}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
        title={title}
        author={author}
        url={url}
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
    </div>

  )
}

export default App