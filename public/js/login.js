let errormsg = document.createElement('h3');

function hideApp() {
  let layer = document.querySelector('.layer-app');
  layer.style.transition='all .5s ease-in-out';
  layer.style.transform='translate(120%)';
  document.querySelector('#reset-button').style.display = 'none';
}

function showApp() {
  let layer = document.querySelector('.layer-app');
  layer.style.transition='all .5s ease-in-out';
  layer.style.transform='translate(0%)';
  document.querySelector('#reset-button').style.display = '';
}

function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      token = result.credential.accessToken;
      user = result.user;
      showApp();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
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

function readData() {
  let database = firebase.database();
  database.ref('/users/' + uid).once('value').then(function(snapshot) {
    document.querySelector('.layer-login').removeChild = errormsg;
    let data = snapshot.val();
    if (data) {
      movingMotivators = data.data;
      Object.keys(movingMotivators).forEach((el) => {
        let mmv = document.querySelector('img[alt="' + el + '"]');
        let target = document.querySelector('div[id=target' + movingMotivators[el] + ']');
        target.appendChild(mmv);
      });
    }
  }).catch(function(error) {
    hideApp();
    console.log(error);
    errormsg.className = 'user';
    errormsg.innerText = 'No tienes permisos para logarte. Solo usuarios del dominio @kairosds.com';
    document.querySelector('.layer-login').appendChild(errormsg);
  });
}

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
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
      readData();
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

window.onload = function() {
  initApp();
};