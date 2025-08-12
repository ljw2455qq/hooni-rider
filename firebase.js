// firebase.js
// 🔹 여기에 본인 Firebase 콘솔에서 발급받은 정보 넣으세요
var firebaseConfig = {
    apiKey: "AIzaSyA5hMmN9QFgdFtaA5gicS_pj-blu_jJdvE",
    authDomain: "rider-bf48b.firebaseapp.com",
    databaseURL: "https://rider-bf48b-default-rtdb.firebaseio.com",
    projectId: "rider-bf48b",
    storageBucket: "rider-bf48b.firebasestorage.app",
    messagingSenderId: "1026929653322",
    appId: "1:1026929653322:web:b90541cccba5b4186198b3"
};

// Firebase 초기화 (중복 방지)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var db = firebase.database();