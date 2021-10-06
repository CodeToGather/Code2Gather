import { initializeApp } from '@firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
} from '@firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyASaqw4fLp2DYyfmVRfQojpXcvFzlcVKs8',
  authDomain: 'code2gather-df5c6.firebaseapp.com',
  projectId: 'code2gather-df5c6',
  storageBucket: 'code2gather-df5c6.appspot.com',
  messagingSenderId: '333844889339',
  appId: '1:333844889339:web:e8aee02dd38ceceefd3a5e',
  measurementId: 'G-MFN27CTW6J',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
const githubAuthProvider = new GithubAuthProvider();

const signInWithFirebase = (): Promise<UserCredential> =>
  signInWithPopup(auth, githubAuthProvider);

export { signInWithFirebase };
