const refBBDD = '/usuarios';
let eventos;
let data;

function getTpl(evento) {
  const tpl = `
    <p id="${evento}">
      <section class="comparativa-data">
        <div class="evento">Evento: <span id="evento">${evento}</span></div>
        <div class="votantes">Numero de Votantes: <span id="votantes"></span></div>
      </section>
      <section>
        <div class="SourceZoneGroup">
          <div class="sourcezone" id="pos0"></div>
          <div class="sourcezone" id="pos1"></div>
          <div class="sourcezone" id="pos2"></div>
          <div class="sourcezone" id="pos3"></div>
          <div class="sourcezone" id="pos4"></div>
          <div class="sourcezone" id="pos5"></div> 
          <div class="sourcezone" id="pos6"></div>
          <div class="sourcezone" id="pos7"></div>
          <div class="sourcezone" id="pos8"></div>
          <div class="sourcezone" id="pos9"></div>
        </div>
      </section>
    </p>  
  `;
  return tpl;
}

function readData() {
  let database = firebase.database();
  const layer = document.querySelector('.layer-app');
  database.ref('/usuarios').on('value', function(snapshot) {
    eventos = [];
    data = snapshot.val();
    if (data) {
      let output = '';
      for (const ob in data) {
        output += getTpl(ob);
      }
      layer.innerHTML = output;
    }
  });
}

function readDataEvento(refBBDD) {
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