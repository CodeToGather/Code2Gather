// Import the functions you need from the SDKs you need
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export const auth = getAuth();
