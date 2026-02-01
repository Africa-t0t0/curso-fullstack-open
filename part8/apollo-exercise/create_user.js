const mongoose = require('mongoose')
const User = require('./models/user')
require('dotenv').config()

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongodb.fp1zlj8.mongodb.net/library?appName=MongoDB`

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const createUser = async () => {
    try {
        const existingUser = await User.findOne({ username: 'root' })
        if (existingUser) {
            console.log('User "root" already exists')
            return
        }

        const user = new User({
            username: 'root',
            favoriteGenre: 'refactoring'
        })

        await user.save()
        console.log('User "root" created')
    } catch (error) {
        console.error('Error creating user:', error.message)
    } finally {
        mongoose.connection.close()
    }
}

createUser()
