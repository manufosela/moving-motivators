import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

export default firebase.initializeApp({
  apiKey: 'AIzaSyDz5IYjWluMaYOuPQIykwZgm2jpTuu8rgI',
  authDomain: 'kdsmotivators.firebaseapp.com',
  databaseURL: 'https://kdsmotivators.firebaseio.com',
  projectId: 'kdsmotivators',
  storageBucket: 'kdsmotivators.appspot.com',
  messagingSenderId: '186969414218',
  appId: '1:186969414218:web:500ee4397b5da3d3'
});
