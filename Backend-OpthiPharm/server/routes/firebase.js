const express = require("express");
const app = express();

const admin = require("firebase-admin"); //Importar el paquet de Firebase.

//Variable per portar les claus per poder-se connectar a la base de dades.
var serviceAccount = require("../../opthi-pharm-firebase-adminsdk-3kefy-74e6670030.json");

//Inicialització per connectar-se a la base de dades.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://opthi-pharm-default-rtdb.firebaseio.com/",
});

//Constant que importa totes les funcions que podem fer a la db
const db = admin.database();

//Post Crear una nova medicina
app.post("/new-medicine", function (req, res) {
  console.log(req.body);
  const newMedicine = {
    name: req.body.name,
    row: req.body.row,
    colum: req.body.colum,
    des: req.body.des,
    price: req.body.price,
    amount: req.body.amount,
  };

  db.ref("medicines").push(newMedicine);

  res.send({ ok: true });
});

//GET obtenir totes les medicines que hi ha en la base de dades.
app.get("/get-medicines", function (req, res) {
  let Array_data = [];

  db.ref("medicines").once("value", (snapshot) => {
    data = snapshot.forEach((element) => {
      const el = element.val();
      const object = {
        name: el.name,
        des: el.des,
        colum: el.colum,
        row: el.row,
        id: element.key,
        price: el.price,
        amount: el.amount,
      };
      console.log(object);

      Array_data.push(object);
    });
    res.send(Array_data);
  });
});

//GET per eliminar medicaments de la base de dades.
app.delete("/delete-medicines", function (req, res) {
  console.log(req.body.id);
  db.ref("medicines/" + req.body.id).remove();
  res.send("deleted");
});

//PUT per cambiar el contador dels medicaments de la base de dades.
app.put("/amount-update", function (req, res) {
  const id = req.body.id;
  const amount = req.body.amount;

  db.ref("medicines/" + id).update({ amount: amount });
  res.send("Actualizado");
});

app.put("/update-doc", function (req, res) {
  const id = req.body.id;
  const update = {};

  const amount = req.body.amount;
  const name = req.body.name;
  const des = req.body.des;
  const colum = req.body.colum;
  const row = req.body.row;
  const price = req.body.price;

  if (amount !== "") {
    update.amount = amount;
  }

  if (name !== "") {
    update.name = name;
  }
  if (des !== "") {
    update.des = des;
  }
  if (colum !== "") {
    update.colum = colum;
  }
  if (row !== "") {
    update.row = row;
  }
  if (price !== "") {
    update.price = price;
  }

  console.log(update);

  db.ref("medicines/" + id).update(update);

  res.send("Actualizado");
});

module.exports = app;
