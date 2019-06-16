const firebaseConfig = {
  apiKey: "AIzaSyCtqhOne-E9iUlgZJ2T0ifGPPuPdy6d2jQ",
  authDomain: "moving-motivators.firebaseapp.com",
  databaseURL: "https://moving-motivators.firebaseio.com",
  projectId: "moving-motivators",
  storageBucket: "moving-motivators.appspot.com",
  messagingSenderId: "186969414218",
  appId: "1:186969414218:web:500ee4397b5da3d3"
};
firebase.initializeApp(firebaseConfig);

let movingMotivators = {};

let user;
let token;
let displayName;
let email;
let emailVerified;
let photoURL;
let isAnonymous;
let uid;
let providerData;