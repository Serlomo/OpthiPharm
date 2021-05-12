//DOM Elements

const newRegister = document.getElementById("new");
const registros = document.getElementById("registros");
const name_ = document.getElementById("name");
const des = document.getElementById("des");
const colum = document.getElementById("colum");
const row = document.getElementById("row");
const preu = document.getElementById("preu");
const quantitat = document.getElementById("quantitat");
const lol = document.getElementById("lol");

newRegister.addEventListener("submit", NewMedicines);

let Array_Medicamentos = [];

GetMedicines();

function NewMedicines() {
  console.log("hola");

  fetch("http://localhost:3001/new-medicine", {
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

  fetch("http://localhost:3001/get-medicines", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        Array_Medicamentos.push(element);
      });
      carregarTaula(Array_Medicamentos);
    });
}

function eliminarMedicament(id) {
  console.log("Hola");
  let Array_id = [];
  fetch("http://localhost:3001/delete-medicines", {
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

function carregarTaula(comanda) {
  let html = comanda.map(generarHtmlRegistroPersona).join("");

  registros.innerHTML = html;

  function generarHtmlRegistroPersona(index) {
    return `<tr>
  <td>${index.name}</td>
  <td>${index.des}</td>
  <td><input type="button" class="btn btn-danger btn-sm" onclick="eliminarMedicament('${index.id}');" value="Afegira a la comanda"></td>
</tr>`;
  }
}
