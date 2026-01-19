const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const mainRouter = require("./routes/index");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());


app.use(cors());

// Prefijo para las rutas
app.use("/api", mainRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

module.exports = app;
