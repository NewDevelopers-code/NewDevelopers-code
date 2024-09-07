// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZB4jmbhWHTQbk7FiDtu3q-cE1ryByvTA",
    authDomain: "timeinout-310f0.firebaseapp.com",
    databaseURL: "https://timeinout-310f0-default-rtdb.firebaseio.com",
    projectId: "timeinout-310f0",
    storageBucket: "timeinout-310f0.appspot.com",
    messagingSenderId: "756973933115",
    appId: "1:756973933115:web:34344b10d3ee05279e421e",
    measurementId: "G-7Z0B2DDQN9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const database = firebase.database();