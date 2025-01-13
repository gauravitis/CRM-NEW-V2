import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5BEmOWEO1mtNFANu72SZHQAkUBWpIe2Q",
  authDomain: "crm-v2-989b4.firebaseapp.com",
  projectId: "crm-v2-989b4",
  storageBucket: "crm-v2-989b4.firebasestorage.app",
  messagingSenderId: "613435330993",
  appId: "1:613435330993:web:78389601de1411651a6d90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app; 