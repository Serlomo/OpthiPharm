const API_DEV = "http://localhost:3001"; // Direcció de proves
const API_PRO = "http://192.168.50.52:3001"; // Direcció de producció (Rasberry Pi - Back-end).

const API_DIRECTION = API_DEV; // Configuració d'on apuntarà el client per poder-se comunicar amb la base de dades.

const newRegister = document.getElementById("btnCrearRegistro"); //Importació de l'element btnCrearRegistro, boto per crear el medicament.
const registros = document.getElementById("registros");
const name_ = document.getElementById("name"); //Importació de l'element name, input del nom del medicament.
const des = document.getElementById("des"); //Importació de l'element des, input de la descripció del medicament.
const colum = document.getElementById("colum"); //Importació de l'element colum, input de la columna on es trobarà el medicament.
const row = document.getElementById("row"); //Importació de l'element row, input de la row on es trobarà el medicament.
const preu = document.getElementById("preu"); //Importació de l'element preu, input del preu el medicament.
const quantitat = document.getElementById("quantitat"); //Importació de l'element quantitat, input del STOCK del medicament.

const modic = document.getElementById("modic"); //Importació de l'element modic, és la targeta per quan modifiquem el medicament.

// const p = document.getElementById("btnNEW");

newRegister.addEventListener("click", NewMedicines); //Quan fan clic en newRegistre (Crear noumedicament) Executem NewMedicines.

let Array_Medicamentos = []; // Array que s'emplena amb tots els medicaments de la base de dades.
let Array_id = []; // Array amb només els id dels medicaments.

GetMedicines(); //Cada cop que carregem la pagina executem GetMedicines.

//Funció per crear un nou medicament.
function NewMedicines() {
  //console.log("NewMedicines");

  //Petició POST http per crear els medicaments, aquesta ruta apunta a la API /new-medicine del back-end.
  fetch(`${API_DIRECTION}/new-medicine`, {
    method: "POST",
    body: JSON.stringify({
      name: name_.value,
      des: des.value,
      row: row.value,
      colum: colum.value,
      amount: quantitat.value,
      price: preu.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  Array_Medicamentos = []; //Fiquem el Array estigui completament vuit.
  GetMedicines(); //Executem la funció GetMedicines.
  carregarTaula(Array_Medicamentos); //Carregem la taula amb el nou medicament.
}

// Funció GetMedicaments per portar els medicaments de base de dades.
function GetMedicines() {
  // console.log("GetMedicaments");

  //Petició GET http per obtenir els medicaments, aquesta ruta apunta a la API /get-medicines del back-end.
  fetch(`${API_DIRECTION}/get-medicines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }) // Quan obtenim els medicaments, recorrem l'array i col·loque'm el medicament en els Arrays.
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        Array_Medicamentos.push(element);
        Array_id.push(element.id);
      });
      carregarTaula(Array_Medicamentos); //Carregem la taula amb els medicaments de la base de dades.
    });
}

//Funció per eliminar una medicina de la base de dades a partir de l'id del medicament.
function eliminarMedicament(id) {
  //console.log(`eliminarMedicament + ${id}`);

  let Array_id = [];
  //Petició DELETE http per borrar el medicament, aquesta ruta apunta a la API /delete-medicines del back-end.
  fetch(`${API_DIRECTION}/delete-medicines`, {
    method: "DELETE",
    body: JSON.stringify({
      id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  Array_Medicamentos.forEach((element) => {
    Array_id.push(element.id);
  });

  const pos = Array_id.indexOf(id); //Identifica quina posició es troba l'element que volem eliminar.

  //console.log(pos);
  // Borarem l'objecta en l'Array_Medicamentos i en l'array Array_id.
  const max = pos + 1;
  Array_Medicamentos.splice(pos, max);
  Array_id.splice(pos, max);

  carregarTaula(Array_Medicamentos); //Executem la funció carregarTaula i carregem la nova taula amb les noves dades.
}

//console.log(Array_Medicamentos);

//Funció per editar el medicament seleccionat aparti de l'id.
function edit(id) {
  const pos = Array_id.indexOf(id); //Busquem la posició d'on es troba.
  const ob = Array_Medicamentos[pos]; //Trobem l'objecte on es troba tota la informació del medicament.
  const mod_name = ob.name; //Nom del medicament

  modic.innerHTML = ""; //Borem la targeta de modificar el medicament.

  //Mostrem la targeta de modificar el medicament.
  modic.innerHTML += ` 
  <div>
   <h1>Estas modifican el medicament ${mod_name}</h1>
   <input type="button" class="btn btn-danger btn-sm" onclick="cancelaEdit();" value="Cancelar modificar el medicament">
   <input type="button" class="btn btn-danger btn-sm" onclick="update('${id}');" value="Modificar el medicament">
  </div>
`;
}

//Funció per actualitzar el medicament a la base de dades apartir del id.
function update(id) {
  // console.log("update");

  //Petició PUT http per modficar el medicament, aquesta ruta apunta a la API /update-doc del back-end.
  fetch(`${API_DIRECTION}/update-doc`, {
    method: "PUT",
    body: JSON.stringify({
      name: name_.value,
      des: des.value,
      row: row.value,
      colum: colum.value,
      amount: quantitat.value,
      price: preu.value,
      id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

  Array_Medicamentos = []; //Fiquem el Array estigui completament vuit.
  GetMedicines(); //Executem la funció GetMedicines.
  carregarTaula(Array_Medicamentos); //Carregem la taula amb el nou medicament.
}

//Cancel·lem editar el medicament.
function cancelaEdit() {
  //console.log("cancelaEdit");
  modic.innerHTML = "";
}

//Funció per carregar la taula amb els medicaments
function carregarTaula(m) {
  let html = m.map(TaulaComandaHtml).join(""); //Recorrem el array de medicaments, criden cada cop a la funció TaulaComandaHtml i l'encadena'm.

  registros.innerHTML = html; //col·loque'm a html LINEA 164 el codi HTML generat amb la funció anterior

  function TaulaComandaHtml(index) {
    // console.log(index);

    return `<tr>
  <td>${index.name}</td>
  <td>${index.des}</td>
  <td>${index.colum}</td>
  <td>${index.row}</td>
  <td>${index.amount}</td>
  <td>${index.price} €</td>
  <td><input type="button" class="btn btn-danger btn-sm" onclick="edit('${index.id}');" value="Editar medicament"></td>
  <td><input type="button" class="btn btn-danger btn-sm" onclick="eliminarMedicament('${index.id}');" value="Eliminar de base de dades"></td>
</tr>`;
  }
}
