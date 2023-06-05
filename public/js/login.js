const errormsg = document.createElement('h3');
let refBBDD;
let $event;
let $cards;
let $title;
let $dataCards;
let database = false;
database = (!database) ? firebase.database() : database;

function hideApp() {
  const layer = document.querySelector('.layer-app');
  layer.style.transition='all .5s ease-in-out';
  layer.style.transform='translate(120%)';
  layer.style.visibility='hidden';
  document.querySelector('#reset-button').style.display = 'none';

}

function showApp() {
  const layer = document.querySelector('.layer-app');
  layer.style.transition='all .5s ease-in-out';
  layer.style.transform='translate(0%)';
  layer.style.visibility='visible';
  document.querySelector('#reset-button').style.display = '';
}

function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      token = result.credential.accessToken;
      user = result.user;
      showApp();
    }).catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');      
      } else { 
        firebase.auth().signOut();
        hideApp();
        errormsg.className = 'user';
        errormsg.innerText = 'No tienes permisos para logarte. Solo usuarios del dominio @kairosds.com';
        document.querySelector('.layer-login').appendChild(errormsg);
      }
    });
  } else {
    firebase.auth().signOut();
    hideApp();
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

function getRefBBDD() {
  return new Promise((resolve, reject) => {
    database.ref('/active').once('value').then(function(snapshot) {
      const data = snapshot.val();
      if (data) {
        $event = data.event;
        $cards = data.cards;
        $title = data.title;
        if (document.location.href.indexOf('index.html') > -1) {
          database.ref(`/evento/${$event}`).once('value').then(function(snapshot) {
            const data = snapshot.val();
            if (data) {
              const fechaHoraActual = new Date();
              const fechaInicioParts = data.fechaini.split('/');
              const horaInicioParts = data.horaini.split(':');
              const fechaHoraInicio = new Date(fechaInicioParts[2], fechaInicioParts[1] - 1, fechaInicioParts[0], horaInicioParts[0], horaInicioParts[1], 0);
              const fechaFinParts = data.fechafin.split('/');
              const horaFinParts = data.horafin.split(':');
              const fechaHoraFin = new Date(fechaFinParts[2], fechaFinParts[1] - 1, fechaFinParts[0], horaFinParts[0], horaFinParts[1], 0);
              console.log(data.fechaini, data.horaini, data.fechafin, data.horafin);
              //console.log(fechaHoraActual, fechaHoraInicio, fechaHoraFin);
              if (fechaHoraActual >= fechaHoraInicio && fechaHoraActual <= fechaHoraFin) {
                resolve($event);
              } else {
                console.log('No hay evento activo');
                reject('No hay evento activo');
              }
            }
          });
        } else {
          if (document.querySelector('.evento')) {
            document.querySelector('.evento').innerHTML = $title;
          }
          resolve($event);
        }
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

function loadImages() {
  return new Promise((resolve, reject) => {
    database.ref(`/cards/${$cards}`).once('value').then(function(snapshot) {
      const data = snapshot.val();
      if (data) {
        $dataCards = data;
        const images = [...document.querySelectorAll('.sourcezone img[id^="source"]')];
        images.forEach((img, index) => {
          // console.log(img, index);
          img.src = data[index].image;
          img.alt = data[index].title;
          img.title = data[index].descripcion;
        });
        resolve();
      }
    });
  });
}

function initApp() {
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      displayName = user.displayName;
      email = user.email;
      emailVerified = user.emailVerified;
      photoURL = user.photoURL;
      isAnonymous = user.isAnonymous;
      uid = user.uid;
      providerData = user.providerData;
      document.getElementById('quickstart-sign-in').textContent = 'Sign out';
      document.getElementById('user').textContent = `${displayName} (${email})`;
      document.querySelector('header').textContent = $title;
      await loadImages();
      readData(refBBDD);
      showApp();
    } else {
      document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
      document.getElementById('user').textContent = '';
      hideApp();
    }
    document.getElementById('quickstart-sign-in').disabled = false;
  });
  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}

window.onload = async function() {
  getRefBBDD().then(response=>{
    refBBDD = response;
    initApp();
  }).catch((error) => {
    console.log(error);
    if (document.querySelector('.reset-button')) {
      document.querySelector('.reset-button').style.display = 'none';
    }
    document.getElementById('user').textContent = 'No hay evento activo';
  });  
};