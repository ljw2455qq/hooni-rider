// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// --- Firebase 프로젝트 설정 (실제 값으로 교체) ---
const firebaseConfig = {
  apiKey:        "AIzaSyA5hMmN9QFgdFtaA5gicS_pj-blu_jJdvE",
  authDomain:    "rider-bf48b.firebaseapp.com",
  databaseURL:   "https://rider-bf48b-default-rtdb.firebaseio.com",
  projectId:     "rider-bf48b",
  storageBucket: "rider-bf48b.firebasestorage.app",
  messagingSenderId: "1026929653322",
  appId:         "1:1026929653322:web:b90541cccba5b4186198b3",
  measurementId: "G-Z0H55KJ1W7"
};

// --- Firebase 초기화 ---
const firebaseApp = initializeApp(firebaseConfig);

// 필요한 서비스 인스턴스를 바로 가져옵니다
export const db   = getDatabase(firebaseApp);     // Realtime Database
export const auth = getAuth(firebaseApp);         // 인증

export default firebaseApp;
