import firebaseApp from './_common/init';
import { $, $$, AppEvents, useConfig } from './_common/utils';

let data;
let results;
let votantes;
let sortable;
let votos;
let cards = {
  aceptacion: 'images/cards/aceptacion.png',
  curiosidad: 'images/cards/curiosidad.png',
  estatus: 'images/cards/estatus.png',
  honra: 'images/cards/honra.png',
  libertad: 'images/cards/libertad.png',
  maestria: 'images/cards/maestria.png',
  meta: 'images/cards/meta.png',
  orden: 'images/cards/orden.png',
  poder: 'images/cards/poder.png',
  relaciones: 'images/cards/relaciones.png'
};
let usuarios;

const readData = function() {
  let database = firebaseApp.database();
  votos = {
    aceptacion: 0,
    curiosidad: 0,
    estatus: 0,
    honra: 0,
    libertad: 0,
    maestria: 0,
    meta: 0,
    orden: 0,
    poder: 0,
    relaciones: 0
  };
  database.ref('/users').on('value', function(snapshot) {
    usuarios = [];
    data = snapshot.val();
    if (data) {
      results = Object.keys(data).map(el => {
        usuarios.push(data[el].username);
        return data[el].data;
      });
      votantes = Object.keys(data).length;
      $('#votantes').innerHTML = votantes;
      $('#users').innerHTML =
        '<div>' + usuarios.join('</div><div>') + '</div>';
      results.forEach(el => {
        if (el !== undefined) {
          Object.keys(el).forEach(k => {
            votos[k] += parseInt(0 + el[k]);
          });
        }
      });
      Object.keys(votos).forEach(k => {
        votos[k] = Math.round((votos[k] / votantes) * 100) / 100;
      });

      sortable = [];
      for (var pos in votos) {
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
        $('#pos' + p).innerHTML =
          '<div id="res' + p + '"></div>';
        $('#res' + p).innerHTML = '';
        let img = document.createElement('img');
        img.src = cards[card[0]];
        if (card[1] > 0) {
          $('#pos' + countP).appendChild(img);
          $('#res' + countP).innerHTML = card[1];
          countP++;
        }
      });
    } else {
      if (parseInt($('#votantes').innerHTML) > 0) {
        $('#votantes').innerHTML = 0;
        $('#users').innerHTML = '';
        Object.keys(votos).forEach((el, p) => {
          $('#pos' + p).innerHTML = '';
        });
        votos = {
          aceptacion: 0,
          curiosidad: 0,
          estatus: 0,
          honra: 0,
          libertad: 0,
          maestria: 0,
          meta: 0,
          orden: 0,
          poder: 0,
          relaciones: 0
        };
      }
    }
  });
}