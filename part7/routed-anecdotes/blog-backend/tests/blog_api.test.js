const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/models');

const helper = require('./test_helpers');
const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promises = blogObjects.map(blog => blog.save())
    await Promise.all(promises)
});

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 2)
    });

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToView = blogsAtStart[0];
        const resultNote = await api.get(`/api/blogs/${blogToView._id}`).expect(200).expect('Content-Type', /application\/json/)
        assert.strictEqual(resultNote.body.title, blogToView.title)
    })
});

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Third blog",
            author: "Third author",
            url: "https://thirdblog.com",
            likes: 3
        }
        await api.post('/api/blogs').send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    });

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "Third blog",
            author: "Third author",
            likes: 3
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    });

    test('a blog must have likes', async () => {
        const blogWithoutLikes = {
            title: "Third blog",
            author: "Third author",
            url: "https://thirdblog.com"
        }
        await api.post('/api/blogs').send(blogWithoutLikes).expect(400)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    });
});

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    });
});

describe('updating a blog', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        const updatedBlog = {
            title: "Updated blog",
            author: "Updated author",
            url: "https://updatedblog.com",
            likes: 10
        }
        await api.put(`/api/blogs/${blogToUpdate._id}`).send(updatedBlog).expect(200)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    });
});

after(async () => {
    await mongoose.connection.close();
});