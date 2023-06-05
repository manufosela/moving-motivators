let data;
let results;
let votantes;
let sortable;
let votos;
let usuarios;

let $event;
let $cards;
let $title;

const cards = {};
const usernameUid = {};
const $baseVotos = {};

function loadResultCards() {
  return new Promise((resolve, reject) => {
    database.ref(`/cards/${$cards}`).once('value').then(function(snapshot) {
      const data = snapshot.val();
      if (data) {
        data.forEach((img, index) => {
          cards[data[index].title] = data[index].image;
          $baseVotos[data[index].title] = 0;
        });
      }
      resolve();
    });
  });
}

function getRefBBDD() {
  return new Promise((resolve, reject) => {
    database.ref('/active').once('value').then(function(snapshot) {
      const data = snapshot.val();
      if (data) {
        $event = data.event;
        $cards = data.cards;
        $title = data.title;
        resolve($event);
      } else {
        console.log('No hay evento activo');
        reject('No hay evento activo');
      }
    }).catch(function(error) {
      console.log(error);
      reject(error);
    });
  });
}

function getResults() {
  results = Object.keys(data).map((el) => {
    usuarios.push(data[el].username);
    return data[el].data;
  });
  return results;
}

function sortResults() {
  results.forEach((el) => {
    if (el !== undefined) {
      Object.keys(el).forEach(
        (k) => {
          if (votos[k] === undefined && $cards.includes(k)) {
            votos[k] = 0;
          }
          votos[k] += parseInt(0 + el[k]);
        }
      );
    }
  });
  Object.keys(votos).forEach((k) => {
    votos[k] = Math.round((votos[k] / votantes) * 100) / 100;
  });

  sortable = [];
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
}

function drawNoData() {
  if (parseInt(document.getElementById('votantes').innerHTML) > 0) {
    document.getElementById('votantes').innerHTML = 0;
    document.getElementById('users').innerHTML = '';
    Object.keys(votos).forEach((el, p)=>{
      document.getElementById('pos' + p).innerHTML = '';
    });
    votos = $baseVotos;
  }
}

function drawUsersList() {
  if (data) {
    results = getResults();
    votantes = Object.keys(data).length;
    document.getElementById('votantes').innerHTML = votantes;
    document.getElementById('users').innerHTML = '<a href="#GLOBAL" data-user="global" class="active">GLOBAL</a>'
    if (email === 'manu.fosela@kairosds.com') {
      document.getElementById('users').innerHTML += usuarios.map((user)=>{
        // return `<div>${user}</div>`;
        return `<div><a data-user="${usernameUid[user]}" href="#">${user}</a></div>`;
      }).join('');
    } else {
      document.getElementById('users').innerHTML = '';
    }
    document.querySelector('#users').addEventListener('click', getUser);
    sortResults();
  } else {
    drawNoData();
  }
}

async function _readDataUser(refBBDD, user) {
  return new Promise((resolve, reject) => {
    database.ref(`/usuarios/${refBBDD}/${user}`).on('value', function(snapshot) {
      //votos = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
      votos = $baseVotos;
      usuarios = [];
      data = snapshot.val();
      if (Object.keys(data.data).length !== 10) {
        reject('No hay datos');
      }
      let dataSortable = Object.entries(data.data);
      dataSortable.sort(function(a, b) {
        return a[1] - b[1];
      });
      //console.log(sortable);
      let countP = 0;
      dataSortable.forEach((card, p) => {
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
      resolve(); 
    });
  });
}

async function _readData(refBBDD) {
  return new Promise((resolve) => {
    database.ref(`/usuarios/${refBBDD}`).on('value', function(snapshot) {
      //votos = { "aceptacion": 0, "curiosidad": 0, "estatus": 0, "honra": 0, "libertad": 0, "maestria": 0, "meta": 0, "orden": 0, "poder": 0, "relaciones": 0  };
      votos = $baseVotos;
      usuarios = [];
      data = snapshot.val();
      if (data) {
        for (const ob in data) {
          if (Object.prototype.hasOwnProperty.call(data, ob)) {
            usernameUid[data[ob].username] = ob;
          }
        }
      }
      drawUsersList();
      resolve(); 
    });
  });
}

function drawNoData() {
  if (parseInt(document.getElementById('votantes').innerHTML) > 0) {
    Object.keys(votos).forEach((el, p)=>{
      document.getElementById('pos' + p).innerHTML = '';
    });
  }
}

async function getUser(event) {
  let uid = event.target.dataset.user;
  document.querySelector('#users a.active')?.classList.remove('active');
  event.target.classList.add('active');
  if (uid === 'global') {
    await getRefBBDD();
    await loadResultCards();
    await _readData($event);
  } else {
    await getRefBBDD();
    await loadResultCards();
    await _readDataUser($event, uid).catch((error)=>{
      console.log(error);
      drawNoData();
    });
    console.log(data.data);
  }
}

async function readData(refBBDD) {
  await getRefBBDD();
  await loadResultCards();
  await _readData(refBBDD);
}

let database = firebase.database();