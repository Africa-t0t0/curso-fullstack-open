require('dotenv').config()

const DB_USER_NAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const PORT = process.env.PORT || 3003;

let mongoUrl = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/bloglist?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'test') {
    mongoUrl = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/bloglist-test?retryWrites=true&w=majority`;
} else if (process.env.NODE_ENV === 'development') {
    mongoUrl = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/bloglist-dev?retryWrites=true&w=majority`;
} else if (process.env.NODE_ENV === 'production') {
    mongoUrl = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/bloglist?retryWrites=true&w=majority`;
}


module.exports = {
    mongoUrl,
    PORT
};