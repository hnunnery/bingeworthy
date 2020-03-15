import firebase from "firebase";
import "firebase/firestore";
// import "firebase/auth";

if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyDR9dJ9BYDqp6wq2JM1WROnnntQZjAuvCk",
    authDomain: "lis5364.firebaseapp.com",
    databaseURL: "https://lis5364.firebaseio.com",
    projectId: "lis5364",
    storageBucket: "lis5364.appspot.com",
    messagingSenderId: "1042118068451",
    appId: "1:1042118068451:web:6dcb14fdbf920bc8599dd6",
    measurementId: "G-SYZ5ESZS56"
  };
  firebase.initializeApp(config);
}

const db = firebase.firestore();

export { db };
