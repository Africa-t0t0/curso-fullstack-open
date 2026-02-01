const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongodb.fp1zlj8.mongodb.net/library?appName=MongoDB`

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const authors = [
    {
        name: 'Robert Martin',
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
    },
    {
        name: 'Sandi Metz', // birthyear not known
    },
]

const books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        genres: ['classic', 'crime']
    },
    {
        title: 'Demons',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        genres: ['classic', 'revolution']
    },
]

const seed = async () => {
    try {
        await Author.deleteMany({})
        await Book.deleteMany({})
        console.log('Deleted existing data')

        // Insert Authors
        await Author.insertMany(authors)
        console.log('Authors added')

        // Create Books with references
        for (let book of books) {
            const author = await Author.findOne({ name: book.author })
            if (author) {
                const newBook = new Book({
                    title: book.title,
                    published: book.published,
                    author: author._id,
                    genres: book.genres
                })
                await newBook.save()
                console.log(`Saved book: ${book.title}`)
            } else {
                console.log(`Author not found for book: ${book.title}`)
            }
        }

        console.log('Seeding complete')
    } catch (error) {
        console.error('Error seeding database:', error.message)
    } finally {
        mongoose.connection.close()
    }
}

seed()
