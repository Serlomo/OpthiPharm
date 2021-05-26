//DOM Elements

const API_DEV = "http://localhost:3001";
const API_PRO = "http://192.168.50.52:3001";

const API_DIRECTION = API_PRO;

const most = document.getElementById("most");

let Array_Medicamentos = [];
let correct = false;

GetMedicines();

function GetMedicines() {
  console.log("hola");
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
        Array_Medicamentos.push(element);
        console.log(Array_Medicamentos.length);
        if (Array_Medicamentos.length !== 0) {
          state();
          correct = true;
        }
      });
    });
}
console.log(Array_Medicamentos);

if (correct == false) {
  not_oper();
}

function state() {
  most.innerHTML = "";

  most.innerHTML += `
  <div class="row">
    <div class="col-5"><h3>La Base de dades i el back-end estan operatius</h3></div>
    <div class="col-5 card bg-success">
    </div>
  </div>
`;
}

function not_oper() {
  most.innerHTML = "";

  most.innerHTML += `
  <div class="row">
  <div class="col-5"><h3>La Base de dades i el back-end estan operatius</h3></div>
  <div class="col-5 card bg-danger">
  </div>
</div>
`;
}
