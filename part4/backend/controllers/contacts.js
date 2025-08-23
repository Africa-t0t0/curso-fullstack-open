const contactsRouter = require("express").Router();

const Contact = require("../models/models.js");

contactsRouter.get("/", (request, response, next) => {
    console.log("GET /api/persons", request.body);
    Contact.find({}).then(contacts => {
        response.json(contacts);
    }).catch(error => {
        next(error);
    });
});

contactsRouter.get("/:id", (request, response, next) => {
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

contactsRouter.delete("/:id", (request, response, next) => {
    const id = request.params.id;

    Contact.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

contactsRouter.put("/:id", (request, response, next) => {
    const { name, number } = request.body;

    Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: "query" })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

contactsRouter.post("/", async (request, response, next) => {
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

module.exports = contactsRouter;
