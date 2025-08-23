require('dotenv').config()

const dbUserName = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbCluster = process.env.DB_CLUSTER


const dataBaseUri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}.mongodb.net/contactApp?retryWrites=true&w=majority`
const inputdataBaseUri1 = `mongodb+srv://${dbUserName}:`;
const inputdataBaseUri2 = `@${dbCluster}.mongodb.net/contactApp?retryWrites=true&w=majority`


module.exports = {
    dataBaseUri,
    inputdataBaseUri1,
    inputdataBaseUri2
}