const firebaseConfig = {
  apiKey: "AIzaSyDz5IYjWluMaYOuPQIykwZgm2jpTuu8rgI",
  authDomain: "kdsmotivators.firebaseapp.com",
  databaseURL: "https://kdsmotivators.firebaseio.com",
  projectId: "kdsmotivators",
  storageBucket: "kdsmotivators.appspot.com",
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