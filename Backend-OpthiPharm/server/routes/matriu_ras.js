const express = require("express"); //Importar els requeriments per muntar les rutes API
const app = express();
const Gpio = require("onoff").Gpio; //Inclou onoff per interactuar amb el GPIO

app.post("/comanda", function (req, res) {
  //Constants per poder canviar els paràmetres de la màquina.
  const Interval_Mateix_Calaix = 2000;
  const Interval_Sortida_Activada = 500;

  //Constans per recollir la informació que arriba del client.
  const row = req.body.row;
  const colum = req.body.colum;

  //Sortidas del GPIO
  const Colum_1_s = new Gpio(13, "out");
  const Colum_2_s = new Gpio(19, "out");
  const Colum_3_s = new Gpio(26, "out");

  const Row_1_s = new Gpio(16, "out");
  const Row_2_s = new Gpio(20, "out");
  const Row_3_s = new Gpio(21, "out");

  //Matrius de sortida per afegir l'has sortides que s'executaran
  const row_ = [Colum_1_s, Colum_2_s, Colum_3_s];
  const colum_ = [Row_1_s, Row_2_s, Row_3_s];

  //Pins de las sortides del GPIO
  const sortidas_row = [26, 27, 28];
  const sortidas_colum = [14, 15, 16];

  let Array_row = []; //Array per col·locar les files en ordre

  for (let i = 0; i < 3; i++) {
    const Row = orden(i); //Executem la funcio per fer el triatge de cada una de las filas.
    Array_row.push(Row); //Ficar el resultat a l'array.
  }

  //Funció per ordenar les files i columnes.
  function orden(Fila) {
    let Array_Colum = [];
    let Array_Row = [];
    for (let index = 0; index < row.length; index++) {
      const row_ = row[index];
      if (row_ == Fila) {
        Array_Colum.push(colum[index]);
        Array_Row.push(row[index]);
      }
    }
    return { Array_Colum, Array_Row };
  }

  //Plantilla per poder fer un esquema de las sortides que san d'executar.
  let Rep = { Numero_0: 0, Numero_1: 0, Numero_2: 0 };
  let Array_Final = []; //Array que obtindrà l'objecte "Rep" ple de les vegades que tindrem d'executar las sortides

  //For per recórrer cada una de les posicions i crear els objectes descrits anteriorment
  for (let index = 0; index < Array_row.length; index++) {
    Rep = { Numero_0: 0, Numero_1: 0, Numero_2: 0 };
    const Colum_Array = Array_row[index].Array_Colum;
    console.log(Colum_Array);
    Colum_Array.forEach(function (numero) {
      switch (numero) {
        case "0":
          Rep.Numero_0 = Rep.Numero_0 + 1;
          break;
        case "1":
          Rep.Numero_1 = Rep.Numero_1 + 1;
          break;
        case "2":
          Rep.Numero_2 = Rep.Numero_2 + 1;
          break;

        default:
          break;
      }
    });

    Array_Final.push(Rep);
  }

  console.log(Rep);
  console.log(Array_Final);

  let Colum = "";
  let Row = "";

  //Funció per activar les sortides
  const Ex_Sortides = (again, colum, row) => {
    if (again != 0) {
      // Guardem l'identificador d'interval per després cancel·lar-lo.
      var id_intervalo = setInterval(hazAlert, Interval_Mateix_Calaix);
      var i_contador = 0; //Comptador per saber quantes portem executades
      //Mostrem per la power shell quines sortides són las que san activat.
      console.log("Activo la Fila: " + sortidas_row[row]);
      console.log("Activo la Columna: " + sortidas_colum[colum]);
      //Fiquem les sortides que volem activar en les variables.
      Colum = row_[row];
      Row = colum_[colum];
      //Activem las sortides seleccionades  (GPIO)
      Colum.writeSync(1);
      Row.writeSync(1);
      //Fem que les sortides estiguin activades un temps determinat.
      setInterval(des, Interval_Sortida_Activada);
      //Funció per desactivar les sortides.
      function des() {
        Colum.writeSync(0);
        Row.writeSync(0);
      }

      //Fució que es crida cada cert temps si és que la comanda hi ha més d'una execució per columna
      function hazAlert() {
        // Quan arribem al número indicat per aquesta columna no es tornarà a executar sinó seguirà executen-se la sortida.
        if (i_contador >= again - 1) clearInterval(id_intervalo);
        else {
          //Comentaris explicats mes entre la línia de codi 79 a 90.
          console.log("Activo la Fila: " + sortidas_row[row]);
          console.log("Activo la Columna: " + sortidas_colum[colum]);

          Colum = row_[row];
          Row = colum_[colum];

          Colum.writeSync(1);
          Row.writeSync(1);

          setInterval(des, 500);

          function des() {
            Colum.writeSync(0);
            Row.writeSync(0);
          }
          i_contador++;
        }
      }
      return "ok";
    }
  };

  //Funció per saber el temps que hem d'esperar entre fila i fila
  function max(numero) {
    const Colum_0 = Array_Final[numero].Numero_0;
    const Colum_1 = Array_Final[numero].Numero_1;
    const Colum_2 = Array_Final[numero].Numero_2;

    const Array_max = [];
    Array_max.push(Colum_0, Colum_1, Colum_2);

    const max = Math.max(...Array_max);
    const x = max * 2000;

    console.log(x);

    return x;
  }

  let Array_Control = [];

  control();
  //Funció que la qui porta el control d'executar les sortides
  function control() {
    let id_0 = 0;
    let id_1 = 0;
    //For per determinar en quina fila hem de començar a executar el codi.
    for (let index = 0; index < 3; index++) {
      if (
        Array_Final[index].Numero_0 |
        Array_Final[index].Numero_1 |
        (Array_Final[index].Numero_2 != 0)
      ) {
        Array_Control.push(index);
      }
    }

    //Tres possibilitats de començar. Els setIntervals són per seguir el codi en execució
    if (Array_Control[0] == 0) {
      Execut(0);
      const tmp = max(0);

      id_0 = setInterval(row_1, tmp);
    }
    if (Array_Control[0] == 1) {
      Execut(1);
      const tmp = max(1);
      id_1 = setInterval(row_2, tmp);
    }
    if (Array_Control[0] == 2) {
      row_2();
    }

    //Diferentas ocions que ens podrem trobar
    function row_1() {
      clearInterval(id_0);
      Execut(1);
      const tmp = max(1);
      id_1 = setInterval(row_2, tmp);
    }

    function row_2() {
      clearInterval(id_1);
      Execut(2);
    }
  }

  //Funció per avisar que la comanda ha sigut executada
  const t = max(0);
  const tm = max(1);
  const tmp = max(0);

  const temps_total = t + tm + tmp;
  const id_total = setInterval(send, temps_total);

  //Funció per enviar una resposta al client.
  function send() {
    clearInterval(id_total);
    res.send({ ok: true });
  }
});
module.exports = app;
