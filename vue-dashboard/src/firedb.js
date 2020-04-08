import Firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyDtOdBN8233THYIdOpZSmOkbF_W0fBIbaY",
  authDomain: "urbanmonitor-d7a3b.firebaseapp.com",
  databaseURL: "https://urbanmonitor-d7a3b.firebaseio.com",
  projectId: "urbanmonitor-d7a3b",
  storageBucket: "urbanmonitor-d7a3b.appspot.com",
  messagingSenderId: "176085566593",
  appId: "1:176085566593:web:771c8082ccc7ab6be97980"
};
// Initialize Firebase
let app = Firebase.initializeApp(firebaseConfig)
export const dataRef = app.database().ref('/dataframe')
