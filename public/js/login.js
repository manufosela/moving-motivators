const errormsg = document.createElement('h3');
let refBBDD;

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
    database.ref('/active_event').once('value').then(function(snapshot) {
      const data = snapshot.val();
      if (data) {
        resolve(data);
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
  refBBDD = await getRefBBDD();
  initApp();
};