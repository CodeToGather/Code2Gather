import { initializeApp } from '@firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
} from '@firebase/auth';

console.log(process.env.FIREBASE_API_KEY);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUTREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
const githubAuthProvider = new GithubAuthProvider();

const signInWithFirebase = (): Promise<UserCredential> =>
  signInWithPopup(auth, githubAuthProvider);

export { signInWithFirebase };
