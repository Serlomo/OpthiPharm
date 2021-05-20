const API_DEV = "http://localhost:3001";
const API_PRO = "http://192.168.50.109:3001";

const API_DIRECTION = API_DEV;

const most = document.getElementById("most");
const btnBus = document.getElementById("btn-bus");
const registros = document.querySelector("#registros");

const quan = document.getElementById("quantitat");

let Array_Medicamentos = [];
let Array_NomMedica = [];

GetMedicaments();

function GetMedicaments() {
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
        Array_NomMedica.push(element.name);
      });
    });
}

//Autocompletar busquedas

var marcas = Array_NomMedica;

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;

      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;

      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;

    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  btnBus.addEventListener("click", searchArray);

  function searchArray() {
    console.log("hola");
    const res_bus = Array_NomMedica.indexOf(inp.value);
    if (res_bus != -1) {
      const object = Array_Medicamentos[res_bus];
      most.innerHTML = "";

      most.innerHTML += `<div class="card" >
      <div class="card-header">
      ${object.name}
    </div>
    <h5 class="card-title"></h5> 
    <p class="card-text">${object.des}</p> 
    <h6>Preu: ${object.price} </h6> 
     <input type="button" class="btn btn-outline-success"  onclick="afegirComanda('${res_bus}');" value="Afegira a la comanda">
     <input type="button" class="btn btn-danger btn-sm" onclick="borraBusqueda();" value="Eliminar">
     </div>
  `;
    }
  }
}

function borraBusqueda() {
  most.innerHTML = "";
}

let comanda = [];
let id_rep = [];

let total = 0;

function afegirComanda(res_bus) {
  const object = Array_Medicamentos[res_bus];

  let pre = quan.value;
  console.log(pre);
  if (pre == 0) {
    pre = 1;
  }

  object.quantitat = pre;
  console.log(object);

  const price = object.price;
  total = pre * price;

  const rep = id_rep.includes(object.id);

  if (rep == true) {
    // alert("No pot afegir dos meicaments iguals");
  } else {
    id_rep.push(object.id);
    comanda.push(object);
    console.log(comanda);
    carregarTaula(comanda);
    console.log(id_rep);
  }
}

function carregarTaula(comanda) {
  let html = comanda.map(generarHtmlRegistroPersona).join("");

  registros.innerHTML = html;

  function generarHtmlRegistroPersona(index) {
    return `<tr>
  <td>${index.name}</td>
  <td>${index.quantitat}</td>
  <td>${index.price}</td>
  <td>${total}</td>
  <td><input type="button" class="btn btn-danger btn-sm" onclick="eliminarComanda('${index.id}');" value="Eliminar de la comanda"></td>
</tr>`;
  }
}

function eliminarComanda(index) {
  let pos_id = [];

  comanda.forEach((element) => {
    pos_id.push(element.id);
  });

  const pos = pos_id.indexOf(index);
  console.log(pos);

  const max = pos + 1;
  comanda.splice(pos, max);
  id_rep.splice(pos, max);

  carregarTaula(comanda);
}

const btn_comanda = document.getElementById("btn-comanda");

btn_comanda.addEventListener("click", executarComanda);

function executarComanda() {
  let ArrayRow = [];
  let ArrayColum = [];
  console.log(comanda);

  let amount = "";
  let quantitat = "";
  let id = "";
  let Stock = "";

  comanda.forEach((element) => {
    const row = element.row;
    const colum = element.colum;
    amount = element.amount;
    quantitat = element.quantitat;
    id = element.id;

    Stock = amount - quantitat;

    for (let index = 0; index < quantitat; index++) {
      ArrayColum.push(colum);
      ArrayRow.push(row);
    }
  });

  fetch("http://localhost:3001/comanda", {
    method: "POST",
    body: JSON.stringify({
      row: ArrayRow,
      colum: ArrayColum,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

  fetch("http://localhost:3001/amount-update", {
    method: "PUT",
    body: JSON.stringify({
      id: id,
      amount: Stock,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

autocomplete(document.getElementById("marcas"), marcas);
