const express = require('express')
const cors = require('cors')

const middleware = require('./utils/middleware')

const blogRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')

const app = express()

app.use(cors())
app.use(middleware.requestLogger)
app.use(express.json())

app.use(middleware.jwtVerify)
app.use(middleware.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;