require("./config/config");

const express = require("express");
// const mongoose = require("mongoose");
const path = require("path");

const app = express();

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json({limit: '10mb'}));

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuración global de rutas
app.use(require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});