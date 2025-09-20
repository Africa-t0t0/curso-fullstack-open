const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, handleLike, handleRemove }) => {
  const currentUser = JSON.parse(window.localStorage.getItem('loggedBlogUser'));

  return (
    <div style={blogStyle}>
      <ul>
        <li>{blog.title} by {blog.author}</li>
        <li>{blog.url}</li>
        <li>{blog.likes} <button onClick={() => handleLike(blog)}>like</button></li>
        <li>{blog.likedBy ? blog.likedBy.map(user => user.username).join(', ') : 'No likes'}</li>
      </ul>
      <div>
        {blog.user && blog.user.username === currentUser?.username && (
          <button onClick={() => handleRemove(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog