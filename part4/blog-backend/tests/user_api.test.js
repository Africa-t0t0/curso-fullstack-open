const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helpers')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.init()
        const passwordHash = await bcrypt.hash('password1', 10)
        const user = new User({ username: 'root', passwordHash, name: 'root' })
        await user.save()
    })

    test('creation succeeds with a valid username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'user3',
            name: 'User 3',
            password: 'password3'
        }
        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert.strictEqual(usernames.includes('user3'), true)
    })

    test('creation fails with a username that is already taken', async () => {
        const usersAtStart = await helper.usersInDb()
        console.log("usersAtStart", usersAtStart)
        const newUser = {
            username: 'root',
            name: 'Root',
            password: 'password1'
        }
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with a username that is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'us',
            name: 'User',
            password: 'password'
        }
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    });

    test('creation fails with a password that is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'user4',
            name: 'User 4',
            password: 'pa'
        }
        await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})