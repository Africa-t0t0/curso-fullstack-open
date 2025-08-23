const Contact = require("./models");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
      } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
      }

    next(error);
};


morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});


app.get("/api/persons", (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Contact.findById(request.params.id).then(contact => {
        if (contact) {
            response.json(contact);
        } else {
            response.status(404).end();
        }
    }).catch(error => {
        next(error);
    });
});

app.get("/info", (request, response) => {
    Contact.countDocuments().then(count => {
        response.send(`Phonebook has info for ${count} contacts`);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    Contact.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));

});

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;

    Contact.findByIdAndUpdate(request.params.id, { name, number }, {new: true, runValidators: true, context: "query"})
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

app.post("/api/persons/", async (request, response, next) => {
    const content = request.body;

    if (!content || content === undefined) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    // Validate required fields
    if (content.name === "" || !content.name) {
        return response.status(400).json({
            error: "name is required"
        });
    }

    if (content.number === "" || !content.number) {
        return response.status(400).json({
            error: "number is required"
        });
    }

    // Check for existing name
    const existingName = await Contact.findOne({ name: content.name });
    if (existingName) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    // Check for existing number
    const existingNumber = await Contact.findOne({ number: content.number });
    if (existingNumber) {
        return response.status(400).json({
            error: "number must be unique"
        });
    }

    // Create and save new contact
    const contact = new Contact({
        name: content.name,
        number: content.number
    });

    contact.save()
        .then(savedContact => {
            response.json(savedContact);
        })
        .catch(error => next(error));
});

const PORT = process.env.PORT || 3001;


// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});