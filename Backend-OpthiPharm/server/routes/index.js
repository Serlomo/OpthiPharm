const express = require("express");

const app = express();

//Importació de tots els arxius.
app.use(require("./matriu"));
app.use(require("./firebase"));

module.exports = app;
