const mongoose = require("mongoose");
const { dataBaseUri } = require("./database");

const validatePhoneNumber = require("./utils");

mongoose.set("strictQuery", false);
mongoose.connect(dataBaseUri)
    .then(result => {
        console.log("mongo connection success!");
    })
    .catch(error => {
        console.log("mongo connection error:", error.message);
    });

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: validatePhoneNumber
    },
    id: Number,
});


// we add this in order to filter mongo version control
contactSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Contact", contactSchema);