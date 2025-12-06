import { app, db, storage } from './firebase-config.js';
import {
  collection, query, where, orderBy, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
