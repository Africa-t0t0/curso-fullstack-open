const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const User = require('./models/user')
const jwt = require('jsonwebtoken')

// const typeDefs = require('./schema') // Removed duplicate declaration

const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/library?appName=MongoDB`

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

// ... typeDefs and resolvers ...

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Subscription {
    bookAdded: Book!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.genre) {
                return Book.find({ genres: args.genre }).populate('author')
            }
            return Book.find({}).populate('author')
        },
        allAuthors: async () => {
            return Author.find({})
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Author: {
        bookCount: async (root) => {
            return Book.collection.countDocuments({ author: root._id })
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            let author = await Author.findOne({ name: args.author })

            if (!author) {
                author = new Author({ name: args.author })
                try {
                    await author.save()
                } catch (error) {
                    throw new GraphQLError(error.message, {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }

            const book = new Book({ ...args, author: author._id })

            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error
                    }
                })
            }

            const populatedBook = await book.populate('author')

            pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })

            return populatedBook
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const author = await Author.findOne({ name: args.name })
            if (!author) return null

            author.born = args.setBornTo
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },
}

const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    })

    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })

    await server.start()

    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const auth = req ? req.headers.authorization : null
                if (auth && auth.startsWith('Bearer ')) {
                    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
                    const currentUser = await User.findById(decodedToken.id)
                    return { currentUser }
                }
            },
        }),
    )

    const PORT = 4000

    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}`)
    })
}

start()