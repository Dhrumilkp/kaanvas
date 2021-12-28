import firebase from 'firebase';

const app = {
    apiKey: "AIzaSyCzKAhwoNOTNmzZ3i-2fhVjUXzCCSc6_Y0",
    authDomain: "onelink-cards-backend.firebaseapp.com",
    projectId: "onelink-cards-backend",
    storageBucket: "onelink-cards-backend.appspot.com",
    messagingSenderId: "154501126589",
    appId: "1:154501126589:web:857159dac383e784705ad4",
    measurementId: "G-NETGYG5TTT"
};

if(!firebase.app.length > 0)
{
    firebase.initialize.app(app);
    console.log("Firebase has been initalized");
}

export module firebase;