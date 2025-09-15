const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const user = JSON.parse(window.localStorage.getItem('loggedBlogUser'));

const Blog = ({ blog, handleLike, handleRemove }) => (
  <div style={blogStyle}>
    <ul>
      <li> {blog.author}</li>
      <li> {blog.url}</li>
      <li> {blog.likes} <button onClick={() => handleLike(blog)}>like</button></li>
      <li> {blog.likedBy.map((user) => user.username).join(', ')}</li>
    </ul>
    <div>
      {blog.user.username === user.username && (
        <button
          onClick={() => handleRemove(blog)}
        >remove</button>
      )}
    </div>
  </div>
)

export default Blog