const API_DEV = "http://localhost:3001"; // Direcció de proves
const API_PRO = "http://192.168.50.52:3001"; // Direcció de producció (Rasberry Pi - Back-end).

const API_DIRECTION = API_DEV; // Configuració d'on apuntarà el client per poder-se comunicar amb la base de dades.

const est = document.getElementById("est"); //Importació de l'element targeta, on sortirà el medicament buscat.

let Array_Medicamentos = []; // Array que s'emplena amb tots els medicaments de la base de dades.
let correct = false;

GetMedicines(); //Cada cop que carregem la pagina executem GetMedicines.

function GetMedicines() {
  // console.log("GetMedicaments");

  //Petició GET http per obtenir els medicaments, aquesta ruta apunta a la API /get-medicines del back-end.
  Array_Medicamentos = [];
  fetch(`${API_DIRECTION}/get-medicines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        Array_Medicamentos.push(element); //col·loque'm tot els medicaments obtinguts en l'array.
        // console.log(Array_Medicamentos.length);
        //Filtre: Si el array te mes posicions que 0
        if (Array_Medicamentos.length !== 0) {
          state(); //Executem la fucnió satate
          correct = true; //Coloquem a la varibale correct "true".
        }
      });
    });
}
//console.log(Array_Medicamentos);

//Filtre per veure si tenim connexió amb el back-end i la base de dades.
if (correct == false) {
  not_oper(); //Executar funció not_oper.
}

//Funció per mostrar que la connexió està establerta.
function state() {
  est.innerHTML = ""; //Esborrem el que té la pantalla

  est.innerHTML += `
  <div class="row m-3">
    <div class="col-5"><h3>La Base de dades i el back-end estan operatius</h3></div>
    <div class="col-5 card bg-success">
    </div>
  </div>
`;
}

//Funció per mostrar que la connexió no esta estableta.
function not_oper() {
  est.innerHTML = ""; //Esborrem el que té la pantalla

  est.innerHTML += `
  <div class="row m-3">
   <div class="col-5"><h3>La Base de dades i el back-end estan operatius</h3></div>
   <div class="col-5 card bg-danger">
  </div>
  </div>
`;
}
