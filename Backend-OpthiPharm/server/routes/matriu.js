////////////////////////////////////////////////////
// Matriu que es pot provar en Windows, la matriu que esta en la rasberry pi es el archiu matriu_ras.js
// Documentació completa en el archiu matriu:ras.js
///////////////////////////////////////////////////

const express = require("express");
const app = express();

app.post("/comanda", function (req, res) {
  //Constants per poder canviar els paràmetres de la màquina.
  const Interval_Mateix_Calaix = 2000;
  const Interval_Sortida_Activada = 500;

  //Constans per recollir la informacio que arriba del client.
  const row = req.body.row;
  const colum = req.body.colum;

  //Pins de las sortides del GPIO
  const sortidas_row = [16, 20, 21];
  const sortidas_colum = [13, 19, 26];

  let Array_row = [];

  for (let i = 0; i < 3; i++) {
    const Row = orden(i); //Executem la funcio per fer el triatge de cada una de las filas.
    Array_row.push(Row);
  }

  let Rep = { Numero_0: 0, Numero_1: 0, Numero_2: 0 };
  let Array_Final = []; 

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

  const Ex_Sortides = (again, colum, row) => {
    if (again != 0) {
      // Guardamos el identificador de intervalo para luego cancelarlo. Se llamara cada segundo
      var id_intervalo = setInterval(hazAlert, Interval_Mateix_Calaix);
      var i_contador = 0;
      console.log("Activo la Fila: " + sortidas_row[row]);
      console.log("Activo la Columna: " + sortidas_colum[colum]);

      function hazAlert() {
        //Quan arribem al numero de vegades d'executar es parara.
        if (i_contador >= again - 1) clearInterval(id_intervalo);
        else {
          console.log("Activo la Fila: " + sortidas_row[row]);
          console.log("Activo la Columna: " + sortidas_colum[colum]);
          i_contador++;
        }
      }
      return "ok";
    }
  };

  function max(numero) {
    const Colum_0 = Array_Final[numero].Numero_0;
    const Colum_1 = Array_Final[numero].Numero_1;
    const Colum_2 = Array_Final[numero].Numero_2;

    const Array_max = [];
    Array_max.push(Colum_0, Colum_1, Colum_2);

    const max = Math.max(...Array_max);
    const x = max * Interval_Mateix_Calaix;

    console.log(x);

    return x;
  }

  let Array_Control = [];

  control();

  function control() {
    let id_0 = 0;
    let id_1 = 0;
    for (let index = 0; index < 3; index++) {
      if (
        Array_Final[index].Numero_0 |
        Array_Final[index].Numero_1 |
        (Array_Final[index].Numero_2 != 0)
      ) {
        Array_Control.push(index);
      }
    }

    if (Array_Control[0] == 0) {
      console.log("paso por aqui");
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

    //Diferentas opcions que ens podrem trobar
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

  //Funcio per executar les sortidas de las filas.
  function Execut(num) {
    const Colum_0 = Array_Final[num].Numero_0;
    const Colum_1 = Array_Final[num].Numero_1;
    const Colum_2 = Array_Final[num].Numero_2;

    const num_0 = 0;
    const num_1 = 1;
    const num_2 = 2;
    Ex_Sortides(Colum_0, num_0, num, () => {});
    Ex_Sortides(Colum_1, num_1, num, () => {});
    Ex_Sortides(Colum_2, num_2, num, () => {});
  }

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

  //Funció per avisar que la comanda ha sigut executada
  const t = max(0);
  const tm = max(1);
  const tmp = max(2);

  const temps_total = t + tm + tmp;
  const id_total = setInterval(send, temps_total);

  function send() {
    clearInterval(id_total);
    res.send({ ok: true });
  }
});
module.exports = app;
