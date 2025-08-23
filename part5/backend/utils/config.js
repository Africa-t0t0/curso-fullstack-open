require("dotenv").config();

const PORT = process.env.PORT || 3001;

const DB_USER_NAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;

const DB_URI = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/contactApp?retryWrites=true&w=majority`;
const DB_URI_1 = `mongodb+srv://${DB_USER_NAME}:`;
const DB_URI_2 = `@${DB_CLUSTER}.mongodb.net/contactApp?retryWrites=true&w=majority`;


module.exports = {
    PORT,
    DB_URI,
    DB_URI_1,
    DB_URI_2
};