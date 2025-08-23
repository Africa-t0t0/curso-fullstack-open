const blogsRouter = require('express').Router();
const Blog = require('../models/models');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    const decodedToken = request.user;
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
        return response.status(400).json({ error: 'user not found' });
    }

    if (!body.url || !body.title || !body.likes) {
        return response.status(400).json({ error: 'url or title or likes is missing' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    response.json(blog);
});


blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
    }
    if (blog.user.toString() !== request.user.id) {
        return response.status(401).json({ error: 'user not authorized' });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
    }
    blog.likes = request.body.likes;
    await blog.save();
    response.json(blog);
});

module.exports = blogsRouter;
