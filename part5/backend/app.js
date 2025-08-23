const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const middleware = require("./utils/middleware");
const app = express();

const contactsRouter = require("./controllers/contacts");
const errorHandler = require("./handlers/error");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(middleware.requestLogger);
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// Registrar las rutas ANTES de los middleware de error
app.use("/api/persons", contactsRouter);

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

// Middleware de manejo de errores debe ir DESPUÉS de las rutas
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

module.exports = app;