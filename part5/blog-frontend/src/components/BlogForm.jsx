import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const addBlog = (event) => {
        event.preventDefault();
        createBlog({
            title,
            author,
            url,
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div
            className='formDiv'
        >
            <h2>Create a new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        name="Title"
                        type="text"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="author">Author</label>
                    <input
                        id="author"
                        name="Author"
                        type="text"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="url">Url</label>
                    <input
                        id="url"
                        name="Url"
                        type="text"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm;