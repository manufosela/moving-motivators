let data;
let results;
let votantes;
let sortable;
let votos;
let usuarios;

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
const usernameUid = {};

function readData(refBBDD) {
  let database = firebase.database();
  votos = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
  database.ref(refBBDD).on('value', function(snapshot) {
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

function getUser(uid) {
  //console.log(data[uid].data);
}