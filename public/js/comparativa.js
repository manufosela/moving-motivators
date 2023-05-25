const refBBDD = '/usuarios';
let eventos;
let data;
const votos = {};
const votantes = {};
const numVotantesTotal = {};
const usernameUid = {};
const usuarios = [];
const cards = {
  "aceptacion": "images/cards/aceptacion.png", 
  "curiosidad": "images/cards/curiosidad.png",
  "estatus": "images/cards/estatus.png",
  "honra": "images/cards/honra.png",
  "libertad": "images/cards/libertad.png",
  "maestria": "images/cards/maestria.png",
  "meta": "images/cards/meta.png",
  "orden": "images/cards/orden.png",
  "poder": "images/cards/poder.png",
  "relaciones": "images/cards/relaciones.png" 
};

function getTpl(evento, votantes) {
  const tpl = `
    <section id="${evento}" class="eventos">
      <p class="comparativa-data">
        <div class="evento">Evento: <span id="evento">${evento}</span></div>
        <div class="votantes">Numero de Votantes: <span id="votantes">${votantes}</span></div>
      </p>
      <p>
        <div class="SourceZoneGroup">
          <div class="sourcezone" id="${evento}_pos0"></div>
          <div class="sourcezone" id="${evento}_pos1"></div>
          <div class="sourcezone" id="${evento}_pos2"></div>
          <div class="sourcezone" id="${evento}_pos3"></div>
          <div class="sourcezone" id="${evento}_pos4"></div>
          <div class="sourcezone" id="${evento}_pos5"></div> 
          <div class="sourcezone" id="${evento}_pos6"></div>
          <div class="sourcezone" id="${evento}_pos7"></div>
          <div class="sourcezone" id="${evento}_pos8"></div>
          <div class="sourcezone" id="${evento}_pos9"></div>
        </div>
      </p>
    </section>  
  `;
  return tpl;
}

function drawResults(eventName, eventData, numVotantes) {
  const votantes = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
  const userKeys = Object.keys(eventData);
  const cardKeys = Object.keys(cards);
  userKeys.forEach((userKey) => {
    usernameUid[eventData[userKey].username] = userKey;
  });
  results = Object.keys(eventData).map((el) => {
    usuarios.push(eventData[el].username);
    return eventData[el].data;
  });
  results.forEach((el) => {
    if (el !== undefined) {
      Object.keys(el).forEach(
        (k) => {
          if (cardKeys.includes(k)) {
            votantes[k] += parseInt(0 + el[k]);
          }
        }
      );
    }
  });
  Object.keys(votantes).forEach((k) => {
    votos[k] = Math.round((votantes[k] / numVotantes) * 100) / 100;
    // console.log(votos[k]);
  });

  sortable = [];
  Object.keys(votos).forEach((pos) => {
    sortable.push([pos, votos[pos]]);
  });
  sortable.sort(function(a, b) {
    return a[1] - b[1];
  });
  // console.log(sortable);
  let countP = 0;
  sortable.forEach((card, p) => {
    document.getElementById(`${eventName}_pos${p}`).innerHTML = `<div id="${eventName}_res${p}"></div>`;
    document.getElementById(`${eventName}_res${p}`).innerHTML = '';
    let img = document.createElement('img');
    img.src = cards[card[0]];
    if (parseFloat(card[1], 10) > 0) {
      document.getElementById(`${eventName}_pos${countP}`).appendChild(img);
      document.getElementById(`${eventName}_res${countP}`).innerHTML = card[1];
      countP++;
    }
  });
}

function readData() {
  let database = firebase.database();
  const layer = document.querySelector('#layerAppComp');
  database.ref('/usuarios').on('value', function(snapshot) {
    eventos = [];
    data = snapshot.val();
    if (data) {
      let output = '';
      for (const ob in data) {
        const votantes = Object.keys(data[ob]).length;
        output += getTpl(ob, votantes);
      }
      layer.innerHTML = output;
      for (const ob in data) {
        const votantes = Object.keys(data[ob]).length;
        drawResults(ob, data[ob], votantes);
      }
    }
  });
}

function readDataEvento(refBBDD) {
  let database = firebase.database();
  votos = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
  database.ref(`/usuarios/${refBBDD}`).on('value', function(snapshot) {
    usuarios = [];
    data = snapshot.val();
    if (data) {
      for (const ob in data) {
        if (Object.prototype.hasOwnProperty.call(data, ob)) {
          usernameUid[data[ob].username] = ob;
        }
      }
      results = Object.keys(data).map((el) => {
        usuarios.push(data[el].username);
        return data[el].data;
      });
      votantes = Object.keys(data).length;
      document.getElementById('votantes').innerHTML = votantes;
      document.getElementById('users').innerHTML = usuarios.map((user)=>{
        return `<div>${user}</div>`;
        //return `<div><a onclick="getUser('${usernameUid[user]}')" href="#">${user}</a></div>`;
      }).join('');
      results.forEach((el) => {
        if (el !== undefined) {
          Object.keys(el).forEach(
            (k) => {
              votos[k] += parseInt(0 + el[k]);
            }
          );
        }
      });
      Object.keys(votos).forEach((k) => {
        votos[k] = Math.round((votos[k] / votantes) * 100) / 100;
      });

      sortable = [];
      // votosKeys = Object.keys(votosKeys);
      // votosKeys.forEach((voto) => {
      //   sortable.push([voto, votos[voto]]);
      // });
      for (let pos in votos) {
        if ({}.hasOwnProperty.call(votos, pos)) {
          sortable.push([pos, votos[pos]]);
        }
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1];
      });
      //console.log(sortable);
      let countP = 0;
      sortable.forEach((card, p) => {
        document.getElementById('pos' + p).innerHTML = '<div id="res' + p + '"></div>';
        document.getElementById('res' + p).innerHTML = '';
        let img = document.createElement('img');
        img.src = cards[card[0]];
        if (card[1] > 0) {
          document.getElementById('pos' + countP).appendChild(img);
          document.getElementById('res' + countP).innerHTML = card[1];
          countP++;
        }
      });
    } else {
      if (parseInt(document.getElementById('votantes').innerHTML) > 0) {
        document.getElementById('votantes').innerHTML = 0;
        document.getElementById('users').innerHTML = '';
        Object.keys(votos).forEach((el, p)=>{
          document.getElementById('pos' + p).innerHTML = '';
        });
        votos = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
      }
    }
  });
}