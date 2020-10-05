import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

const firebase = require("firebase")
require("firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDC9ZfKcbsZRRlbtA66zsAFA3Y4cNf3Vzo",
    authDomain: "chats-3a183.firebaseapp.com",
    databaseURL: "https://chats-3a183.firebaseio.com",
    projectId: "chats-3a183",
    storageBucket: "chats-3a183.appspot.com",
    messagingSenderId: "631537828753",
    appId: "1:631537828753:web:97a5425600b4cb20f2d030",
    measurementId: "G-GHTHH5PD0J"
}

firebase.initializeApp(firebaseConfig)


ReactDOM.render(
    <App />,
    document.querySelector("#root")
)