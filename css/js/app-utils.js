// Firebase init
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBLLmzxVYuivT15HBPPSxMoS2OzojRgJM",
  authDomain: "wap-ps-pethgam.firebaseapp.com",
  databaseURL: "https://wap-ps-pethgam-default-rtdb.firebaseio.com",
  projectId: "wap-ps-pethgam",
  storageBucket: "wap-ps-pethgam.firebasestorage.app",
  messagingSenderId: "430925411362",
  appId: "1:430925411362:web:22857dee585d02fc54467b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ===================== INDEX PAGE =====================
export async function pageIndexSetup() {
  const studentSchool = document.getElementById('studentSchool');
  const studentClass = document.getElementById('studentClass');
  const schoolLogo = document.getElementById('schoolLogo');
  const enterBtn = document.getElementById('enterBtn');

  // Fetch school list
  const schoolsSnap = await getDocs(collection(db, 'schools'));
  const schools = [];
  schoolsSnap.forEach(d => schools.push({ id: d.id, ...d.data() }));
  studentSchool.innerHTML = schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  studentSchool.addEventListener('change', async () => {
    const sel = studentSchool.value;
    if(!sel) { schoolLogo.src = ''; schoolLogo.classList.add('hidden'); return; }
    try {
      const url = await getDownloadURL(ref(storage, `school_logos/${sel}.png`));
      schoolLogo.src = url; schoolLogo.classList.remove('hidden');
    } catch { schoolLogo.classList.add('hidden'); }
  });

  enterBtn.addEventListener('click', () => {
    const name = document.getElementById('studentName').value.trim();
    const cls = studentClass.value;
    const school = studentSchool.value;
    if(!name || !cls || !school) { alert('Fill all fields'); return; }
    const studentId = `${school}_${cls}_${name.replace(/\s/g,'')}_${Date.now()}`;
    localStorage.setItem('studentName', name);
    localStorage.setItem('studentClass', cls);
    localStorage.setItem('studentSchool', school);
    localStorage.setItem('studentId', studentId);
    window.location.href = 'quiz-list.html';
  });
}

// ===================== QUIZ FUNCTIONS =====================
export async function qGetQuizMetaAndQuestions(school, quizId){
  const quizDoc = await getDoc(doc(db, `schools/${school}/quizzes/${quizId}`));
  if(!quizDoc.exists()) return { quizData:null, questionsData:[] };
  const questionsSnap = await getDocs(collection(db, `schools/${school}/quizzes/${quizId}/questions`));
  const questions = [];
  questionsSnap.forEach(d => questions.push({ id:d.id, ...d.data() }));
  return { quizData: quizDoc.data(), questionsData: questions };
}

export async function updateStudentResultWithAttempt(school, cls, studentId, quizId, opts={checkOnly:false, awardIfFirstAttempt:true, coinsToAdd:0, score:0}){
  const docRef = doc(db, `schools/${school}/students/${studentId}_results`);
  const resSnap = await getDoc(docRef);
  let data = resSnap.exists() ? resSnap.data() : { totalCoins:0, quizzes:{} };
  if(opts.checkOnly){
    return data.quizzes[quizId] ? 0 : 1;
  }
  let coinsAdded = 0;
  if(!data.quizzes[quizId] && opts.awardIfFirstAttempt){
    coinsAdded = opts.coinsToAdd;
    data.totalCoins += coinsAdded;
  }
  data.quizzes[quizId] = { score:opts.score, timestamp: Date.now() };
  await setDoc(docRef, data);
  return { coinsAdded, newTotal: data.totalCoins };
}

// ===================== ADMIN =====================
export async function addQuizWithQuestions(school, quizData, questions){
  const quizRef = doc(collection(db, `schools/${school}/quizzes`));
  await setDoc(quizRef, quizData);
  const batchPromises = questions.map(q => addDoc(collection(db, `schools/${school}/quizzes/${quizRef.id}/questions`), q));
  await Promise.all(batchPromises);
  return quizRef.id;
}

export async function uploadSchoolLogo(udise, file){
  const logoRef = ref(storage, `school_logos/${udise}.png`);
  await uploadBytes(logoRef, file);
  return getDownloadURL(logoRef);
}
