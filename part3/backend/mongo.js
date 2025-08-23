const Contact = require("./models");
const { inputdataBaseUri1, inputdataBaseUri2 } = require("./database");
const mongoose = require("mongoose");



function storeContactInDatabase(password, name, number) {


    if (password === null) {
        throw new Error("Password is requiered for querying!");
    }

    mongoose.set("strictQuery", false);

    let fullDataBaseUri = `${inputdataBaseUri1}${password}${inputdataBaseUri2}`;
    mongoose.connect(fullDataBaseUri);

    if (name === null && number === null) {
        // we do the query logic
        Contact.find({}).then(result => {
            console.log("element", result);

            mongoose.connection.close();
        });
    } else {
        // we create a new contact
        const contact = new Contact({
            name: name,
            number: number
        });
        contact.save().then(result => {
            console.log("element", result);
            // muy importante cerrar la conexión solo cuando ya se hayan
            // realizado las operaciones, no pongas nunca mongoose.connection.close
            // fuera del then!
            mongoose.connection.close();
        });
    }
}

const password = process.argv[2] || null;
const name = process.argv[3] || null;
const number = process.argv[4] || null;


storeContactInDatabase(password, name, number);
