const express = require("express");

const app = express();

//Importaci√≥ de tots els arxius.
app.use(require("./matriu"));
app.use(require("./firebase"));

module.exports = app;
