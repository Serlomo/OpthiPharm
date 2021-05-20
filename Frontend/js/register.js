//DOM Elements
const API_DEV = "http://localhost:3001";
const API_PRO = "http://192.168.50.109:3001";

const API_DIRECTION = API_DEV;

const newRegister = document.getElementById("new");
const registros = document.getElementById("registros");
const name_ = document.getElementById("name");
const des = document.getElementById("des");
const colum = document.getElementById("colum");
const row = document.getElementById("row");
const preu = document.getElementById("preu");
const quantitat = document.getElementById("quantitat");
const lol = document.getElementById("lol");

const most = document.getElementById("most");

newRegister.addEventListener("submit", NewMedicines);

let Array_Medicamentos = [];
let Array_id = [];

GetMedicines();

function NewMedicines() {
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
    .then((data) => console.log(data));
}

function GetMedicines() {
  console.log("hola");

  fetch(`${API_DIRECTION}/get-medicines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        Array_Medicamentos.push(element);
        Array_id.push(element.id);
      });
      carregarTaula(Array_Medicamentos);
    });
}

function eliminarMedicament(id) {
  console.log("Hola");
  let Array_id = [];
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

  const pos = Array_id.indexOf(id);

  console.log(pos);

  const max = pos + 1;
  Array_Medicamentos.splice(pos, max);
  Array_id.splice(pos, max);

  carregarTaula(Array_Medicamentos);
}

console.log(Array_Medicamentos);

function edit(id) {
  const pos = Array_id.indexOf(id);
  const ob = Array_Medicamentos[pos];
  const mod_name = ob.name;

  New_Update = 1;

  most.innerHTML = "";

  most.innerHTML += `
  <div>
   <h1>Estas modifican el medicament ${mod_name}</h1>
   <input type="button" class="btn btn-danger btn-sm" onclick="cancelaEdit();" value="Cancelar modificar el medicament">
   <input type="button" class="btn btn-danger btn-sm" onclick="update('${id}');" value="Modificar el medicament">
  </div>
`;
}

function update(id) {
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

  carregarTaula(comanda);
}

function cancelaEdit() {
  New_Update = 1;
  console.log("Hola");
  most.innerHTML = "";
}

function carregarTaula(comanda) {
  let html = comanda.map(generarHtmlRegistroPersona).join("");

  registros.innerHTML = html;

  function generarHtmlRegistroPersona(index) {
    console.log(index);

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
