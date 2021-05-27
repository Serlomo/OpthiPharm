const API_DEV = "http://localhost:3001"; // Direcció de desarollo
const API_PRO = "http://192.168.50.52:3001";// Direcció de producció (Rasberry Pi - Back-end).

const API_DIRECTION = API_PRO; // Configuració d'on apuntarà el client per poder-se comunicar amb la base de dades.

const targeta = document.getElementById("targeta"); //Importació de l'element targeta, on sortirà el medicament buscat.
const spiner_ = document.getElementById("spiner"); // Importacció del element spiner, es el espiner de carrega comanda.
const btnBus = document.getElementById("btn-bus"); // Importació de l'element btn-bus, buto de busqueda del medicament.
const registres = document.querySelector("#registres"); // Importació de l'element registres, taula on sortira la comanda.
const btn_comanda = document.getElementById("btn-comanda"); // Importació de l'element btn-comanda, boto per executar la comanda.

const quan = document.getElementById("quantitat"); // Importació de l'element quantitat, és l'input que trobem per col·locar la quantitat de medicaments que volem.

let Array_Medicaments = []; // Array que s'emplena amb tots els medicaments de la base de dades.
let Array_NomMedica = []; // Array amb només els noms dels medicaments.

GetMedicaments(); // Executem la funció GetMedicaments per portar els medicaments de base de dades.

// Funció GetMedicaments per portar els medicaments de base de dades.
function GetMedicaments() {

  // console.log("GetMedicaments");

  //Petició GET http per obtenir els medicaments, aquesta ruta apunta a la API /get-medicines del back-end.
  fetch(`${API_DIRECTION}/get-medicines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }) // Quan obtenim els medicaments, recorrem l'array i col·loque'm el medicament en els Arrays.
    .then((data) => {
      data.forEach((element) => {
        Array_Medicaments.push(element);
        Array_NomMedica.push(element.name);
      });
    });
}

//Autocompletar busquedas
autocomplete(document.getElementById("marcas"), Array_NomMedica); //Obtenim el id.

//Funció  per autocompletar busquedas. 
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
    a.setAttribute("class", "autocomplete-items text-light p-2");
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  btnBus.addEventListener("click", searchArray); //Quan fan clic en el botó btnBus (Cerca)

  // Funció per mostra la cerca del medicament en una targeta.
  function searchArray() {
    //console.log("searchArray");
    const res_bus = Array_NomMedica.indexOf(inp.value); //Fiques el valor de l'input de cerca i record l'array, per trobar si el nom existeix, si és així torna la posició, si no torna un -1 
    //Si a trobat el medicament saltarà el filtre
    if (res_bus != -1) {
      const object = Array_Medicaments[res_bus]; //Traiem l'objecte que volem aconseguir partir de la posició trobada anteriorment i l'Array_Medicaments.
      targeta.innerHTML = ""; //Borem la targeta anterior.
      //Coloquem la targeta amb els valor del medicament.
      targeta.innerHTML += `<div class="card" >
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

//Funció per borrar la tarjeta de la cerca.
function borraBusqueda() {
  targeta.innerHTML = "";
}

let comanda = [];
let id_rep = [];

//Funció per afegir la comanda a la taula.
function afegirComanda(res_bus) {
  const object = Array_Medicaments[res_bus]; //Donem la posició de l'Array. "La funció searchArray LINEA 121" Activació "LINEA 134".

  let pre = quan.value; //Agafem el valor de quantitat de medicaments volem dispensar. 

  // console.log(pre);
  //Farem un filtre per sempre que no tingui res l'input afegiríem un medicament mínim "Valor predeterminat 1"
  if (pre == 0) {
    pre = 1;
  }

  object.quantitat = pre; //Afegim la propietat quantitat a l'objecte amb el número de medicaments.

  //console.log(object); 

  const price = object.price; //traiem el valor del preu en una constant.
  const total = pre * price; //Calculem el preu total.
  object.total = total; //Afegim la propietat total a l'objecte el preu total unitari.

 //Crem un filtre per identificar si el medicament que s'intenta afegir no està afegit amb anterioritat.
  const rep = id_rep.includes(object.id);

  //Si no passa el filtre mostrarem una alerta (No fiquem l'alerta perquè el programa es bloqueja per alguna raó "està comentat ")
  if (rep == true) {
    // alert("No pot afegir dos meicaments iguals");
  } else {
    id_rep.push(object.id); //Afegirem l'id en una llista que serà amb la que es compara en la LINEA 171. 
    comanda.push(object); //Afegim l'objecta l'Array comanda.
   // console.log(comanda);
    carregarTaula(comanda); //Executem la funció carregarTaula, per actualitzar la taula amb el nou objecte dintre del array comanda. 
   // console.log(id_rep);
  }
}

//Funció per carregar la taula de comanda.
function carregarTaula(comanda) {
  let html = comanda.map(TaulaCoamandaHtml).join(""); //Recorrem el array comanda, criden cada cop a la funció TaulaComandaHtml i l'encadena'm.

  registres.innerHTML = html; //col·loque'm a registres el codi HTML generat amb la funció anterior LINEA 187.

  function TaulaCoamandaHtml(index) { //Funció per genera el HTML.
    return `<tr>
  <td class="text-light">${index.name}</td>
  <td class="text-light">${index.quantitat}</td>
  <td class="text-light">${index.price}€</td>
  <td class="text-light">${index.total}€</td>
  <td class="text-light"><input type="button" class="btn btn-danger btn-sm" onclick="eliminarComanda('${index.id}');" value="Eliminar de la comanda"></td>
</tr>`;
  }
}

//Funció per eliminar un medicament de la taula de comanda.
function eliminarComanda(index) {
  let pos_id = [];

  //Recorrem la comanda i col·loque'm tots els id en l'array declarat anteriorment en la LINEA 204.
  comanda.forEach((element) => {
    pos_id.push(element.id);
  });
  //Busquem quina posició es troba.
  const pos = pos_id.indexOf(index);

  // console.log(pos);
  // Borarem l'objecta en l'array comanda i en l'array id_rep per deixar ficar un altre cop aquest medicament a la comanda.
  const max = pos + 1;
  comanda.splice(pos, max); //Array --> comanda.
  id_rep.splice(pos, max); // Array --> id_rep. Comentat LINEA 170.

  carregarTaula(comanda);//carege'm la taula amb el nou Array comanda.
}

btn_comanda.addEventListener("click", executarComanda); //Quan fan clic en el botó btn_comanda (Executar comanda) crida a la funció executarComanda.

//Funció per executar la comanda.
function executarComanda() {
  let ArrayRow = []; //Array amb les files que s'executaran.
  let ArrayColum = []; //Array amb les columnes que s'executaran.

  // console.log(comanda);

 //Crem let globals per aquesta funció es modificarà el valor més endavant.
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

    Stock = amount - quantitat; //Calculem el Stock que quedarà.

    //Recorrem els array, per poder enviar la comanda. 
    for (let index = 0; index < quantitat; index++) {
      ArrayColum.push(colum);
      ArrayRow.push(row);
    }
  });

  //Activem el spiner de càrrega.
  on_spiner();

  //Fem una petició http POST a la direcció /comanda, "Enviem els arrays a la rasberry pi"
  fetch(`${API_DIRECTION}/comanda`, {
    method: "POST",
    body: JSON.stringify({
      row: ArrayRow,
      colum: ArrayColum,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => console.log(data)); //Mostrem la resposta per consola.
   //Fem una petició http PUT a la direcció /amount-update, "Enviem els Stock que quedara"
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
  .then((data) => {
    //Quan arribi la dada farem para el spiner de càrrega
    if (data.ok === true) {
      off_spiner();
    }
  });
}

//Funció per activar el spiner de càrrega. 
function off_spiner() {
  spiner_.innerHTML += "";
}

//Funció per activar el spiner de càrrega.
function on_spiner() {
  spiner_.innerHTML += `
  <div class="spinner-border text-light" role="status">
  <span class="visually-hidden">Loading...</span>
 </div>
  `;
}


