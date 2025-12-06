// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCBLLmzxVYuivT15HBPPSxMoS2OzojRgJM",
  authDomain: "wap-ps-pethgam.firebaseapp.com",
  databaseURL: "https://wap-ps-pethgam-default-rtdb.firebaseio.com",
  projectId: "wap-ps-pethgam",
  storageBucket: "wap-ps-pethgam.appspot.com",
  messagingSenderId: "430925411362",
  appId: "1:430925411362:web:22857dee585d02fc54467b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
