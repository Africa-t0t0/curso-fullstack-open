import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Feedback from './components/Feedback'
import blogService from './services/blogs'
import loginService from './services/login'


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
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
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

  const loginForm = (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      {user === null ? loginForm : blogForm}
      <Feedback message={notification.message} status={notification.status} />
      {user !== null && (
        <div>
          <p>{user.username} logged in</p>
          <button onClick={handleLogOut}>logout</button>
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>

  )
}

export default App